"""GREM backend — secure analytics proxy.

Serves /api/* on port 8001. Holds Solana Tracker + Zerion keys server-side,
proxies + normalizes provider data, computes GREM intelligence, and falls back
to deterministic realistic mock data when providers are unavailable.

Hardening notes:
- Every response that can contain mock data carries "is_demo": true/false.
- CORS is limited to CORS_ORIGINS (comma separated); no wildcard by default.
- Per-IP rate limit (RATE_LIMIT_PER_MIN, 0 disables) protects provider quota.
- Short in-memory cache (TRACKER_CACHE_SECONDS, 0 disables) avoids repeating
  identical paid provider calls.
"""
import logging
import os
import re
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from datetime import datetime, timezone

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

import intelligence
import mockdata
import providers

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("grem")

SOLANA_ADDRESS_RE = re.compile(r"^[1-9A-HJ-NP-Za-km-z]{32,48}$")
MOCK_ON_ERROR = os.environ.get("MOCK_ON_PROVIDER_ERROR", "true").lower() == "true"

DEFAULT_CORS = "https://grem.site,https://www.grem.site,http://localhost:3000"
CORS_ORIGINS = [
    o.strip() for o in os.environ.get("CORS_ORIGINS", DEFAULT_CORS).split(",") if o.strip()
]

RATE_LIMIT_PER_MIN = int(os.environ.get("RATE_LIMIT_PER_MIN", "60"))
CACHE_TTL = float(os.environ.get("TRACKER_CACHE_SECONDS", "30"))
CACHE_MAX_ITEMS = 500

client_holder: dict = {}
_rate_hits: dict[str, deque] = defaultdict(deque)
_cache: dict[str, tuple[float, dict]] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    mongo = AsyncIOMotorClient(os.environ["MONGO_URL"])
    app.state.db = mongo[os.environ["DB_NAME"]]
    app.state.http = httpx.AsyncClient()
    yield
    await app.state.http.aclose()
    mongo.close()


app = FastAPI(title="GREM Intelligence API", lifespan=lifespan)


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


# Registered BEFORE the CORS middleware so CORS stays outermost and 429
# responses still carry CORS headers (the browser can then read the error).
@app.middleware("http")
async def rate_limit(request: Request, call_next):
    path = request.url.path
    if (
        RATE_LIMIT_PER_MIN <= 0
        or request.method == "OPTIONS"
        or not path.startswith("/api/")
        or path == "/api/health"
    ):
        return await call_next(request)

    now = time.monotonic()
    window = _rate_hits[_client_ip(request)]
    while window and now - window[0] > 60:
        window.popleft()
    if len(window) >= RATE_LIMIT_PER_MIN:
        retry_after = max(1, int(60 - (now - window[0])))
        return JSONResponse(
            status_code=429,
            content={"detail": "rate_limited"},
            headers={"Retry-After": str(retry_after)},
        )
    window.append(now)

    if len(_rate_hits) > 5000:  # keep memory bounded
        stale = [k for k, v in _rate_hits.items() if not v or now - v[-1] > 60]
        for k in stale:
            _rate_hits.pop(k, None)

    return await call_next(request)


app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)


async def tracker_cached(path: str) -> dict:
    """Solana Tracker GET with a short TTL cache. Errors are never cached."""
    now = time.monotonic()
    hit = _cache.get(path)
    if CACHE_TTL > 0 and hit and now - hit[0] < CACHE_TTL:
        return hit[1]
    data = await providers.tracker_get(app.state.http, path)
    if CACHE_TTL > 0:
        if len(_cache) >= CACHE_MAX_ITEMS:
            _cache.pop(next(iter(_cache)))  # evict oldest inserted entry
        _cache[path] = (now, data)
    return data


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
        tracker = await tracker_cached(f"/wallet/{address}")
        wallet = providers.normalize_wallet(address, tracker)
        if not wallet["holdings"] and not wallet["total_usd"]:
            raise ValueError("empty wallet payload")
    except Exception as exc:
        logger.warning("wallet live failed (%s); mock fallback=%s", exc, MOCK_ON_ERROR)
        if not MOCK_ON_ERROR:
            raise HTTPException(status_code=502, detail="provider_unavailable")
        wallet = mockdata.mock_wallet(address)

    derived = intelligence.analyze(wallet)
    result = {
        "source": wallet["source"],
        "is_demo": wallet["source"] != "live",
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
        "is_demo": data["is_demo"],
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
        info = await tracker_cached(f"/tokens/{mint}")
        stats = None
        try:
            stats = await tracker_cached(f"/stats/{mint}")
        except Exception:
            stats = None
        result = providers.normalize_token(mint, info, stats)
        if not result["token"].get("symbol"):
            raise ValueError("empty token payload")
    except Exception as exc:
        logger.warning("token live failed (%s); mock fallback=%s", exc, MOCK_ON_ERROR)
        if not MOCK_ON_ERROR:
            raise HTTPException(status_code=502, detail="provider_unavailable")
        result = mockdata.mock_token(mint)

    score = result["risk"].get("score")
    result["risk"]["level"] = mockdata.risk_level_from_score(score)
    result["is_demo"] = result.get("source") != "live"
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
    return {"source": "mock", "is_demo": True, "count": len(tokens), "tokens": tokens}
