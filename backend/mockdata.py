"""Deterministic, realistic mock data generators for GREM.

Seeded by address/mint so the same input always yields the same output.
Used as a graceful fallback when live providers are unavailable, and for
the Token Discovery prototype grid.
"""
import hashlib
import random
from datetime import datetime, timedelta, timezone

# Curated realistic Solana token universe (names/symbols only; values are generated).
TOKEN_UNIVERSE = [
    ("dogwifhat", "WIF"), ("Bonk", "BONK"), ("Popcat", "POPCAT"),
    ("Jupiter", "JUP"), ("Pyth Network", "PYTH"), ("Jito", "JTO"),
    ("Wen", "WEN"), ("cat in a dogs world", "MEW"), ("BOOK OF MEME", "BOME"),
    ("Slerf", "SLERF"), ("michi", "MICHI"), ("Gigachad", "GIGA"),
    ("Peanut the Squirrel", "PNUT"), ("Moo Deng", "MOODENG"), ("Fwog", "FWOG"),
    ("Goatseus Maximus", "GOAT"), ("Retardio", "RETARDIO"), ("Ponke", "PONKE"),
    ("Daddy Tate", "DADDY"), ("Myro", "MYRO"), ("Silly Dragon", "SILLY"),
    ("Harambe", "HARAMBE"), ("Chintai", "CHEX"), ("Render", "RNDR"),
    ("Helium", "HNT"), ("Raydium", "RAY"), ("Orca", "ORCA"),
    ("Marinade", "MNDE"), ("Drift", "DRIFT"), ("Kamino", "KMNO"),
    ("Tensor", "TNSR"), ("Grass", "GRASS"), ("Wormhole", "W"),
    ("Zeus Network", "ZEUS"), ("Sanctum", "CLOUD"), ("Parcl", "PRCL"),
]


def _seed(value: str) -> random.Random:
    h = int(hashlib.sha256(value.encode()).hexdigest(), 16)
    return random.Random(h)


def _fake_mint(rng: random.Random) -> str:
    alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
    return "".join(rng.choice(alphabet) for _ in range(44))


EXAMPLE_WALLET = "57rXqaQsvgYBKwebP2StfqQeCBjBS4jsrZ7EJN5aU2V9b"


def mock_holdings(rng: random.Random, count: int, sol_price: float):
    picks = rng.sample(TOKEN_UNIVERSE, min(count, len(TOKEN_UNIVERSE)))
    holdings = []
    for name, symbol in picks:
        price = round(rng.uniform(0.0000012, 4.5), 8)
        balance = round(rng.uniform(1000, 5_000_000), 2)
        value = round(price * balance, 2)
        mcap = round(rng.uniform(300_000, 900_000_000), 0)
        liq = round(mcap * rng.uniform(0.02, 0.15), 0)
        holdings.append({
            "mint": _fake_mint(rng),
            "name": name,
            "symbol": symbol,
            "balance": balance,
            "price_usd": price,
            "value_usd": value,
            "market_cap_usd": mcap,
            "liquidity_usd": liq,
            "logo": None,
        })
    holdings.sort(key=lambda h: h["value_usd"], reverse=True)
    return holdings


def mock_wallet(address: str) -> dict:
    rng = _seed(address)
    sol_price = 176.34
    if address == EXAMPLE_WALLET:
        sol_balance = 69.42
        token_count = 955
        token_target = 8400.0
    else:
        sol_balance = round(rng.uniform(0.2, 220), 2)
        token_count = rng.randint(4, 1200)
        token_target = round(rng.uniform(120, 26000), 2)

    sol_value = round(sol_balance * sol_price, 2)
    visible = max(4, min(8, 6))
    holdings = mock_holdings(rng, visible, sol_price)

    # Scale visible token holdings to a coherent target portion.
    cur = sum(h["value_usd"] for h in holdings) or 1
    factor = token_target / cur
    for h in holdings:
        h["value_usd"] = round(h["value_usd"] * factor, 2)
        if h["price_usd"]:
            h["balance"] = round(h["value_usd"] / h["price_usd"], 2)

    total_usd = round(sol_value + sum(h["value_usd"] for h in holdings), 2)

    return {
        "source": "mock",
        "address": address,
        "sol_balance": sol_balance,
        "sol_value_usd": sol_value,
        "sol_price_usd": sol_price,
        "token_count": token_count,
        "holdings": holdings,
        "total_usd": total_usd,
    }


def mock_token(mint: str) -> dict:
    rng = _seed(mint)
    name, symbol = rng.choice(TOKEN_UNIVERSE)
    price = round(rng.uniform(0.0000009, 3.4), 8)
    mcap = round(rng.uniform(15_000, 180_000_000), 0)
    liq = round(mcap * rng.uniform(0.015, 0.16), 0)
    vol = round(mcap * rng.uniform(0.05, 1.4), 0)
    buys = rng.randint(120, 42000)
    sells = rng.randint(90, 38000)
    score = rng.randint(1, 10)
    pump = rng.random() < 0.55
    created = datetime.now(timezone.utc) - timedelta(days=rng.randint(1, 420))
    return {
        "source": "mock",
        "mint": mint,
        "token": {"name": name, "symbol": symbol, "mint": mint, "logo": None,
                  "decimals": rng.choice([6, 9])},
        "market": {"price_usd": price, "market_cap_usd": mcap,
                   "liquidity_usd": liq, "volume_24h_usd": vol},
        "trading": {"buys": buys, "sells": sells, "transactions": buys + sells,
                    "buy_sell_ratio": round(buys / max(sells, 1), 2)},
        "creator": {"wallet": _fake_mint(rng), "creation_date": created.isoformat()},
        "risk": {"score": score, "rugged": score >= 9 and rng.random() < 0.4,
                 "snipers": rng.randint(0, 45), "bundlers": rng.randint(0, 30),
                 "insiders": rng.randint(0, 22),
                 "reasons": _risk_reasons(rng, score)},
        "status": {"pump_fun": pump,
                   "bonding_curve": ("complete" if rng.random() < 0.5 else "in_progress") if pump else None,
                   "decimals": rng.choice([6, 9])},
    }


def _risk_reasons(rng: random.Random, score: int):
    pool = [
        "Mint authority not renounced", "Freeze authority active",
        "Top 10 holders control large supply", "Low liquidity relative to market cap",
        "High sniper wallet concentration", "Bundled launch wallets detected",
        "Insider wallets holding significant supply", "Liquidity not locked",
        "Sudden volume spike", "Creator holds meaningful position",
    ]
    n = 0 if score <= 3 else (2 if score <= 6 else 4)
    return rng.sample(pool, min(n, len(pool)))


def mock_discovery(count: int = 36):
    tokens = []
    now = datetime.now(timezone.utc)
    for name, symbol in TOKEN_UNIVERSE[:count]:
        rng = _seed(symbol + "disc")
        mcap = round(rng.uniform(20_000, 220_000_000), 0)
        liq = round(mcap * rng.uniform(0.015, 0.16), 0)
        vol = round(mcap * rng.uniform(0.04, 1.6), 0)
        score = rng.randint(1, 10)
        age_h = rng.randint(1, 2400)
        tokens.append({
            "mint": _fake_mint(rng),
            "name": name,
            "symbol": symbol,
            "logo": None,
            "price_usd": round(rng.uniform(0.0000009, 3.2), 8),
            "change_24h": round(rng.uniform(-72, 240), 1),
            "market_cap_usd": mcap,
            "liquidity_usd": liq,
            "volume_24h_usd": vol,
            "buys": rng.randint(80, 40000),
            "sells": rng.randint(60, 36000),
            "risk_score": score,
            "risk_level": risk_level_from_score(score),
            "pump_fun": rng.random() < 0.55,
            "is_new": age_h < 48,
            "created_at": (now - timedelta(hours=age_h)).isoformat(),
        })
    return tokens


def risk_level_from_score(score) -> str:
    if score is None:
        return "unknown"
    if score <= 3:
        return "low"
    if score <= 6:
        return "warning"
    return "critical"
