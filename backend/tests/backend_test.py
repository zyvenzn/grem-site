"""Backend tests for GREM."""
import os
import pytest
import requests

BASE_URL = "https://7fb24cad-0cde-4b97-b88d-ad85794f8df0.preview.emergentagent.com"
EXAMPLE_WALLET = "57rXqaQsvgYBKwebP2StfqQeCBjBS4jsrZ7EJN5aU2V9b"
EXAMPLE_TOKEN = "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm"


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# Health
def test_health(client):
    r = client.get(f"{BASE_URL}/api/health", timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d.get("ok") is True


# Wallet
def test_wallet_example(client):
    r = client.get(f"{BASE_URL}/api/wallet/{EXAMPLE_WALLET}", timeout=30)
    assert r.status_code == 200, r.text
    d = r.json()
    assert "portfolio" in d
    p = d["portfolio"]
    for k in ("total_usd", "sol_balance", "token_count", "allocation"):
        assert k in p, f"portfolio missing {k}"
    assert isinstance(d.get("holdings"), list)
    tp = d.get("trading_profile", {})
    for k in ("risk_level", "meme_exposure", "trading_activity", "token_diversity", "low_cap_exposure"):
        assert k in tp, f"trading_profile missing {k}"
    intel = d.get("intelligence", {})
    for k in ("wallet_score", "trader_profile", "patterns", "grems_take"):
        assert k in intel, f"intelligence missing {k}"


def test_wallet_invalid(client):
    r = client.get(f"{BASE_URL}/api/wallet/notavalidaddress", timeout=15)
    assert r.status_code == 422


# Token
def test_token_example(client):
    r = client.get(f"{BASE_URL}/api/token/{EXAMPLE_TOKEN}", timeout=30)
    assert r.status_code == 200, r.text
    d = r.json()
    for k in ("token", "market", "trading", "creator", "risk", "status"):
        assert k in d, f"missing {k}"
    for k in ("name", "symbol", "decimals"):
        assert k in d["token"]
    for k in ("price_usd", "market_cap_usd", "liquidity_usd", "volume_24h_usd"):
        assert k in d["market"]
    for k in ("buys", "sells", "transactions", "buy_sell_ratio"):
        assert k in d["trading"]
    for k in ("score", "level", "rugged", "snipers", "bundlers", "insiders", "reasons"):
        assert k in d["risk"]
    for k in ("pump_fun", "bonding_curve", "decimals"):
        assert k in d["status"]


def test_token_invalid(client):
    r = client.get(f"{BASE_URL}/api/token/xyz", timeout=15)
    assert r.status_code == 422


# Intelligence
def test_intelligence(client):
    r = client.get(f"{BASE_URL}/api/intelligence/{EXAMPLE_WALLET}", timeout=30)
    assert r.status_code == 200, r.text
    d = r.json()
    for k in ("wallet_score", "trader_profile", "patterns", "grems_take", "trading_profile", "portfolio"):
        assert k in d, f"missing {k}"


# Tokens discovery
def test_tokens_list(client):
    r = client.get(f"{BASE_URL}/api/tokens", timeout=15)
    assert r.status_code == 200
    d = r.json()
    tokens = d.get("tokens", d if isinstance(d, list) else [])
    assert isinstance(tokens, list)
    assert len(tokens) >= 20, f"expected ~36 got {len(tokens)}"


def test_tokens_search(client):
    r = client.get(f"{BASE_URL}/api/tokens?q=wif", timeout=15)
    assert r.status_code == 200
    tokens = r.json().get("tokens", [])
    # All tokens should relate to wif
    if tokens:
        assert any("wif" in (t.get("symbol", "") + t.get("name", "")).lower() for t in tokens)


def test_tokens_risk_low(client):
    r = client.get(f"{BASE_URL}/api/tokens?risk=low", timeout=15)
    assert r.status_code == 200
    tokens = r.json().get("tokens", [])
    for t in tokens:
        lvl = (t.get("risk", {}).get("level") if isinstance(t.get("risk"), dict) else t.get("risk_level"))
        assert (lvl or "").lower() == "low", f"non-low risk: {lvl}"


def test_tokens_pumpfun(client):
    r = client.get(f"{BASE_URL}/api/tokens?pump_fun=true", timeout=15)
    assert r.status_code == 200


def test_tokens_new_only(client):
    r = client.get(f"{BASE_URL}/api/tokens?new_only=true", timeout=15)
    assert r.status_code == 200


def test_tokens_sort(client):
    r = client.get(f"{BASE_URL}/api/tokens?sort=market_cap_usd&order=desc", timeout=15)
    assert r.status_code == 200
    tokens = r.json().get("tokens", [])
    caps = []
    for t in tokens:
        mc = t.get("market", {}).get("market_cap_usd") if isinstance(t.get("market"), dict) else t.get("market_cap_usd")
        if mc is not None:
            caps.append(mc)
    assert caps == sorted(caps, reverse=True), "not sorted desc by market_cap"


def test_tokens_min_liquidity(client):
    r = client.get(f"{BASE_URL}/api/tokens?min_liquidity=100000", timeout=15)
    assert r.status_code == 200
    tokens = r.json().get("tokens", [])
    for t in tokens:
        liq = t.get("market", {}).get("liquidity_usd") if isinstance(t.get("market"), dict) else t.get("liquidity_usd")
        if liq is not None:
            assert liq >= 100000, f"liquidity {liq} < 100000"
