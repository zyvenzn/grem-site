"""External provider clients: Solana Tracker + Zerion.

Keys are read from the environment (server-side only) and are never returned
to the client. Every function returns normalized data or raises; callers decide
whether to fall back to mock data.
"""
from __future__ import annotations

import base64
import os

import httpx

SOLANA_TRACKER_BASE = "https://data.solanatracker.io"
ZERION_BASE = "https://api.zerion.io/v1"

TIMEOUT = float(os.environ.get("PROVIDER_TIMEOUT_SECONDS", "12"))


def _tracker_key() -> str:
    key = os.environ.get("SOLANA_TRACKER_API_KEY", "")
    if not key:
        raise RuntimeError("missing SOLANA_TRACKER_API_KEY")
    return key


def _zerion_auth() -> str:
    key = os.environ.get("ZERION_API_KEY", "")
    if not key:
        raise RuntimeError("missing ZERION_API_KEY")
    return base64.b64encode(f"{key}:".encode()).decode()


def _num(*values, default=0.0):
    for v in values:
        if isinstance(v, bool):
            continue
        if isinstance(v, (int, float)):
            return float(v)
        if isinstance(v, str):
            try:
                return float(v)
            except ValueError:
                continue
    return default


async def tracker_get(client: httpx.AsyncClient, path: str) -> dict:
    r = await client.get(
        f"{SOLANA_TRACKER_BASE}{path}",
        headers={"x-api-key": _tracker_key()},
        timeout=TIMEOUT,
    )
    r.raise_for_status()
    return r.json()


async def zerion_get(client: httpx.AsyncClient, path: str, params: dict | None = None) -> dict:
    r = await client.get(
        f"{ZERION_BASE}{path}",
        params=params,
        headers={"Authorization": f"Basic {_zerion_auth()}", "accept": "application/json"},
        timeout=TIMEOUT,
    )
    r.raise_for_status()
    return r.json()


def normalize_wallet(address: str, tracker: dict) -> dict:
    raw = tracker.get("tokens", tracker.get("holdings", tracker.get("data", [])))
    if isinstance(raw, dict):
        raw = raw.get("tokens", raw.get("data", []))
    if not isinstance(raw, list):
        raw = []

    holdings = []
    sol_balance = 0.0
    sol_price = 0.0
    for x in raw:
        tok = x.get("token", x) if isinstance(x, dict) else {}
        pools = x.get("pools") or []
        pool = pools[0] if pools else {}
        price = _num(x.get("priceUsd"),
                     (x.get("price") or {}).get("usd") if isinstance(x.get("price"), dict) else None,
                     (pool.get("price") or {}).get("usd") if isinstance(pool.get("price"), dict) else None)
        balance = _num(x.get("balance"), x.get("amount"), x.get("uiAmount"),
                       (x.get("balance") or {}).get("uiAmount") if isinstance(x.get("balance"), dict) else None)
        value = _num(x.get("value"), x.get("valueUsd"), x.get("totalValue"), balance * price)
        symbol = tok.get("symbol") or x.get("symbol") or "UNKNOWN"
        name = tok.get("name") or x.get("name") or symbol
        mint = tok.get("mint") or x.get("mint") or x.get("address") or x.get("tokenAddress") or ""
        mcap = _num((pool.get("marketCap") or {}).get("usd") if isinstance(pool.get("marketCap"), dict) else pool.get("marketCap"),
                    x.get("marketCapUsd"))
        liq = _num((pool.get("liquidity") or {}).get("usd") if isinstance(pool.get("liquidity"), dict) else pool.get("liquidity"))
        if symbol == "SOL" or mint == "So11111111111111111111111111111111111111112":
            sol_balance = balance
            sol_price = price
        holdings.append({
            "mint": mint, "name": name, "symbol": symbol, "balance": round(balance, 4),
            "price_usd": price, "value_usd": round(value, 2),
            "market_cap_usd": mcap, "liquidity_usd": liq, "logo": tok.get("image") or tok.get("logo"),
        })

    holdings = [h for h in holdings if h["symbol"] != "SOL"]
    holdings.sort(key=lambda h: h["value_usd"], reverse=True)

    total = _num(tracker.get("total"), tracker.get("totalUsd"))
    sol_value = round(sol_balance * sol_price, 2)
    if not total:
        total = round(sol_value + sum(h["value_usd"] for h in holdings), 2)

    return {
        "source": "live",
        "address": address,
        "sol_balance": round(sol_balance, 4),
        "sol_value_usd": sol_value,
        "sol_price_usd": sol_price,
        "token_count": len(raw),
        "holdings": holdings[:8],
        "total_usd": total,
    }


def _risk_reasons(risk: dict) -> list[str]:
    reasons = risk.get("risks") or risk.get("reasons") or []
    out = []
    for item in reasons:
        if isinstance(item, dict):
            out.append(item.get("name") or item.get("description") or str(item))
        else:
            out.append(str(item))
    return out


def _count(val):
    if isinstance(val, dict):
        return val.get("count", len(val))
    if isinstance(val, list):
        return len(val)
    if isinstance(val, (int, float)):
        return int(val)
    return 0


def normalize_token(mint: str, info: dict, stats: dict | None = None) -> dict:
    token = info.get("token", info)
    pools = info.get("pools") or []
    pool = pools[0] if pools else {}
    risk = info.get("risk", {}) or {}
    txns = pool.get("txns", {}) or {}
    stats = stats or {}
    day = stats.get("24h", {}) if isinstance(stats.get("24h"), dict) else {}

    price = _num((pool.get("price") or {}).get("usd") if isinstance(pool.get("price"), dict) else pool.get("price"))
    mcap = _num((pool.get("marketCap") or {}).get("usd") if isinstance(pool.get("marketCap"), dict) else pool.get("marketCap"))
    liq = _num((pool.get("liquidity") or {}).get("usd") if isinstance(pool.get("liquidity"), dict) else pool.get("liquidity"))
    vol = _num(txns.get("volume24h"), txns.get("volume"), day.get("volume"))
    buys = int(_num(txns.get("buys"), day.get("buys")))
    sells = int(_num(txns.get("sells"), day.get("sells")))
    score = risk.get("score")
    decimals = token.get("decimals", pool.get("decimals"))
    market = pool.get("market")

    return {
        "source": "live",
        "mint": mint,
        "token": {"name": token.get("name"), "symbol": token.get("symbol"),
                  "mint": mint, "logo": token.get("image") or token.get("logo"),
                  "decimals": decimals},
        "market": {"price_usd": price, "market_cap_usd": mcap,
                   "liquidity_usd": liq, "volume_24h_usd": vol},
        "trading": {"buys": buys, "sells": sells, "transactions": buys + sells,
                    "buy_sell_ratio": round(buys / max(sells, 1), 2)},
        "creator": {"wallet": (token.get("creation") or {}).get("creator") or pool.get("deployer"),
                    "creation_date": (token.get("creation") or {}).get("created_time")},
        "risk": {"score": score, "rugged": risk.get("rugged", False),
                 "snipers": _count(risk.get("snipers")), "bundlers": _count(risk.get("bundlers")),
                 "insiders": _count(risk.get("insiders") or risk.get("top10")),
                 "reasons": _risk_reasons(risk)},
        "status": {"pump_fun": (market == "pumpfun") or bool(pool.get("curve")),
                   "bonding_curve": pool.get("curvePercentage") or pool.get("curve"),
                   "decimals": decimals},
    }
