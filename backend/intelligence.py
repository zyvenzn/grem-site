"""GREM intelligence engine.

Turns normalized wallet data into readable behavioural insights:
wallet score, trader profile, detected patterns and GREM's natural-language take.
All signals are analytical, not financial advice.
"""
from __future__ import annotations


def _pct(part: float, whole: float) -> float:
    return (part / whole * 100.0) if whole else 0.0


def build_trading_profile(wallet: dict) -> dict:
    holdings = wallet.get("holdings", [])
    total = wallet.get("total_usd", 0) or 1
    token_count = wallet.get("token_count", 0)

    # Meme exposure: share of value in low/mid-cap speculative tokens.
    meme_value = sum(h["value_usd"] for h in holdings
                     if (h.get("market_cap_usd") or 0) < 50_000_000)
    meme_exposure = round(min(_pct(meme_value, total), 100), 0)

    # Low-cap exposure: value in sub-$5M market cap tokens.
    lowcap_value = sum(h["value_usd"] for h in holdings
                       if (h.get("market_cap_usd") or 0) < 5_000_000)
    low_cap_exposure = round(min(_pct(lowcap_value, total), 100), 0)

    # Diversity: scaled from number of tokens held.
    token_diversity = round(min(token_count / 12.0, 100), 0)

    if token_count > 400:
        trading_activity = "High"
    elif token_count > 60:
        trading_activity = "Moderate"
    else:
        trading_activity = "Low"

    if meme_exposure >= 65 or low_cap_exposure >= 45:
        risk_level = "High"
    elif meme_exposure >= 35 or low_cap_exposure >= 20:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "risk_level": risk_level,
        "meme_exposure": meme_exposure,
        "trading_activity": trading_activity,
        "token_diversity": token_diversity,
        "low_cap_exposure": low_cap_exposure,
    }


def classify_trader(wallet: dict, profile: dict) -> str:
    total = wallet.get("total_usd", 0)
    token_count = wallet.get("token_count", 0)
    if total >= 250_000:
        return "Whale"
    if profile["trading_activity"] == "High" and token_count > 400:
        return "High-Frequency Trader"
    if profile["low_cap_exposure"] >= 45:
        return "Micro-Cap Hunter"
    if profile["meme_exposure"] >= 55:
        return "Meme Speculator"
    if profile["token_diversity"] >= 60:
        return "Diversified Trader"
    return "Long-Term Holder"


def wallet_score(wallet: dict, profile: dict) -> int:
    """Composite 0-100 index. Higher = more balanced / lower-risk footprint."""
    score = 55
    score -= profile["meme_exposure"] * 0.28
    score -= profile["low_cap_exposure"] * 0.22
    score += min(profile["token_diversity"], 60) * 0.35
    if (wallet.get("total_usd") or 0) > 50_000:
        score += 10
    sol = wallet.get("sol_balance") or 0
    if sol > 10:
        score += 6
    return int(max(2, min(98, round(score))))


def detect_patterns(wallet: dict, profile: dict) -> list[str]:
    patterns = []
    if profile["low_cap_exposure"] >= 30:
        patterns.append("Frequent low-cap trading")
    if profile["meme_exposure"] >= 45:
        patterns.append("Heavy meme exposure")
    holdings = wallet.get("holdings", [])
    total = wallet.get("total_usd", 0) or 1
    if holdings and (holdings[0]["value_usd"] / total) > 0.5:
        patterns.append("Concentrated holdings")
    if wallet.get("token_count", 0) > 400:
        patterns.append("High transaction frequency")
    if (wallet.get("sol_balance") or 0) > 40:
        patterns.append("Large unrealized SOL position")
    if profile["token_diversity"] >= 60:
        patterns.append("Broad token diversification")
    if not patterns:
        patterns.append("Low-activity, stable footprint")
    return patterns


def grems_take(wallet: dict, profile: dict, trader: str, patterns: list[str]) -> str:
    exposure = "strong" if profile["meme_exposure"] >= 55 else (
        "notable" if profile["meme_exposure"] >= 30 else "limited")
    lead = {
        "Whale": "This is a heavyweight wallet.",
        "High-Frequency Trader": "This wallet trades relentlessly.",
        "Micro-Cap Hunter": "This wallet hunts the smallest caps.",
        "Meme Speculator": "This wallet lives on meme velocity.",
        "Diversified Trader": "This wallet spreads its bets wide.",
        "Long-Term Holder": "This wallet moves slowly and deliberately.",
    }.get(trader, "This wallet has a distinct signature.")
    tail = patterns[0].lower() if patterns else "a quiet footprint"
    return (
        f"{lead} GREM sees {exposure} exposure to speculative Solana assets, "
        f"with behaviour consistent with a {trader.lower()}. "
        f"The dominant pattern is {tail}. "
        "Read these as behavioural signals from on-chain activity — not financial advice."
    )


def analyze(wallet: dict) -> dict:
    profile = build_trading_profile(wallet)
    trader = classify_trader(wallet, profile)
    score = wallet_score(wallet, profile)
    patterns = detect_patterns(wallet, profile)
    take = grems_take(wallet, profile, trader, patterns)

    total = wallet.get("total_usd", 0) or 1
    allocation = []
    for h in wallet.get("holdings", [])[:6]:
        allocation.append({
            "symbol": h["symbol"],
            "value_usd": h["value_usd"],
            "percent": round(_pct(h["value_usd"], total), 1),
        })
    sol_val = wallet.get("sol_value_usd", 0)
    if sol_val:
        allocation.insert(0, {"symbol": "SOL", "value_usd": sol_val,
                              "percent": round(_pct(sol_val, total), 1)})

    return {
        "trading_profile": profile,
        "portfolio": {
            "total_usd": wallet.get("total_usd", 0),
            "sol_balance": wallet.get("sol_balance", 0),
            "sol_value_usd": sol_val,
            "token_count": wallet.get("token_count", 0),
            "allocation": allocation,
        },
        "intelligence": {
            "wallet_score": score,
            "trader_profile": trader,
            "patterns": patterns,
            "grems_take": take,
        },
    }
