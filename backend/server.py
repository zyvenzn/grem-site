"""GREM backend — secure analytics proxy.

Serves /api/* on port 8001. Holds Solana Tracker + Zerion keys server-side,
proxies + normalizes provider data, computes GREM intelligence, and falls back
to deterministic realistic mock data when providers are unavailable.
"""
import logging
import os
import re
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

import intelligence
import mockdata
import providers

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("grem")

SOLANA_ADDRESS_RE = re.compile(r"^[1-9A-HJ-NP-Za-km-z]{32,48}$")
MOCK_ON_ERROR = os.environ.get("MOCK_ON_PROVIDER_ERROR", "true").lower() == "true"

client_holder: dict = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    mongo = AsyncIOMotorClient(os.environ["MONGO_URL"])
    app.state.db = mongo[os.environ["DB_NAME"]]
    app.state.http = httpx.AsyncClient()
    yield
    app.state.http.aclose()
    mongo.close()


app = FastAPI(title="GREM Intelligence API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def valid_solana(addr: str) -> bool:
    return bool(SOLANA_ADDRESS_RE.match(addr or ""))


async def _snapshot(app: FastAPI, kind: str, key: str, result: dict):
    try:
        await app.state.db[f"{kind}_snapshots"].insert_one({
            "key": key, "source": result.get("source"),
            "created_at": datetime.now(timezone.utc),
        })
    except Exception as exc:  # persistence must never break the response
        logger.warning("snapshot failed: %s", exc)


@app.get("/api/health")
async def health():
    return {"ok": True, "service": "grem", "time": datetime.now(timezone.utc).isoformat()}


@app.get("/api/wallet/{address}")
async def wallet_analysis(address: str):
    if not valid_solana(address):
        raise HTTPException(status_code=422, detail="invalid_solana_address")
    wallet = None
    try:
        tracker = await providers.tracker_get(app.state.http, f"/wallet/{address}")
        wallet = providers.normalize_wallet(address, tracker)
        if not wallet["holdings"] and not wallet["total_usd"]:
            raise ValueError("empty wallet payload")
    except Exception as exc:
        logger.info("wallet live failed (%s); using mock", exc)
        if not MOCK_ON_ERROR:
            raise HTTPException(status_code=502, detail="provider_unavailable")
        wallet = mockdata.mock_wallet(address)

    derived = intelligence.analyze(wallet)
    result = {
        "source": wallet["source"],
        "address": address,
        "portfolio": derived["portfolio"],
        "holdings": wallet["holdings"],
        "trading_profile": derived["trading_profile"],
        "intelligence": derived["intelligence"],
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
    }
    await _snapshot(app, "wallet", address, result)
    return result


@app.get("/api/intelligence/{address}")
async def intelligence_dashboard(address: str):
    data = await wallet_analysis(address)
    return {
        "source": data["source"],
        "address": address,
        "wallet_score": data["intelligence"]["wallet_score"],
        "trader_profile": data["intelligence"]["trader_profile"],
        "patterns": data["intelligence"]["patterns"],
        "grems_take": data["intelligence"]["grems_take"],
        "trading_profile": data["trading_profile"],
        "portfolio": data["portfolio"],
        "retrieved_at": data["retrieved_at"],
    }


@app.get("/api/token/{mint}")
async def token_analysis(mint: str):
    if not valid_solana(mint):
        raise HTTPException(status_code=422, detail="invalid_token_mint")
    result = None
    try:
        info = await providers.tracker_get(app.state.http, f"/tokens/{mint}")
        stats = None
        try:
            stats = await providers.tracker_get(app.state.http, f"/stats/{mint}")
        except Exception:
            stats = None
        result = providers.normalize_token(mint, info, stats)
        if not result["token"].get("symbol"):
            raise ValueError("empty token payload")
    except Exception as exc:
        logger.info("token live failed (%s); using mock", exc)
        if not MOCK_ON_ERROR:
            raise HTTPException(status_code=502, detail="provider_unavailable")
        result = mockdata.mock_token(mint)

    score = result["risk"].get("score")
    result["risk"]["level"] = mockdata.risk_level_from_score(score)
    result["retrieved_at"] = datetime.now(timezone.utc).isoformat()
    await _snapshot(app, "token", mint, result)
    return result


@app.get("/api/tokens")
async def token_discovery(
    q: str | None = Query(default=None),
    sort: str = Query(default="volume_24h_usd"),
    order: str = Query(default="desc"),
    risk: str | None = Query(default=None),
    pump_fun: bool | None = Query(default=None),
    new_only: bool | None = Query(default=None),
    min_market_cap: float | None = Query(default=None),
    min_liquidity: float | None = Query(default=None),
    min_volume: float | None = Query(default=None),
):
    tokens = mockdata.mock_discovery(36)
    if q:
        ql = q.lower()
        tokens = [t for t in tokens if ql in t["name"].lower() or ql in t["symbol"].lower()]
    if risk and risk != "all":
        tokens = [t for t in tokens if t["risk_level"] == risk]
    if pump_fun:
        tokens = [t for t in tokens if t["pump_fun"]]
    if new_only:
        tokens = [t for t in tokens if t["is_new"]]
    if min_market_cap:
        tokens = [t for t in tokens if t["market_cap_usd"] >= min_market_cap]
    if min_liquidity:
        tokens = [t for t in tokens if t["liquidity_usd"] >= min_liquidity]
    if min_volume:
        tokens = [t for t in tokens if t["volume_24h_usd"] >= min_volume]

    valid_sort = {"market_cap_usd", "liquidity_usd", "volume_24h_usd",
                  "buys", "sells", "risk_score", "change_24h", "price_usd"}
    key = sort if sort in valid_sort else "volume_24h_usd"
    tokens.sort(key=lambda t: t.get(key, 0), reverse=(order != "asc"))
    return {"source": "mock", "count": len(tokens), "tokens": tokens}
