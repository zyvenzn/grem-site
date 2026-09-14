// GREM intelligence engine (server-side). Port of backend/intelligence.py.
// Turns normalized wallet data into readable behavioural signals (not financial advice).

type Holding = { value_usd: number; market_cap_usd?: number };
type Wallet = {
  holdings: Holding[];
  total_usd: number;
  token_count: number;
  sol_balance: number;
  sol_value_usd: number;
};

const pct = (part: number, whole: number) => (whole ? (part / whole) * 100 : 0);

export function buildTradingProfile(w: Wallet) {
  const total = w.total_usd || 1;
  const memeValue = w.holdings.filter((h) => (h.market_cap_usd ?? 0) < 50_000_000).reduce((s, h) => s + h.value_usd, 0);
  const memeExposure = Math.round(Math.min(pct(memeValue, total), 100));
  const lowcapValue = w.holdings.filter((h) => (h.market_cap_usd ?? 0) < 5_000_000).reduce((s, h) => s + h.value_usd, 0);
  const lowCapExposure = Math.round(Math.min(pct(lowcapValue, total), 100));
  const tokenDiversity = Math.round(Math.min(w.token_count / 12, 100));
  const tradingActivity = w.token_count > 400 ? "High" : w.token_count > 60 ? "Moderate" : "Low";
  const riskLevel = memeExposure >= 65 || lowCapExposure >= 45 ? "High" : memeExposure >= 35 || lowCapExposure >= 20 ? "Medium" : "Low";
  return { risk_level: riskLevel, meme_exposure: memeExposure, trading_activity: tradingActivity, token_diversity: tokenDiversity, low_cap_exposure: lowCapExposure };
}

export function classifyTrader(w: Wallet, p: ReturnType<typeof buildTradingProfile>) {
  if (w.total_usd >= 250_000) return "Whale";
  if (p.trading_activity === "High" && w.token_count > 400) return "High-Frequency Trader";
  if (p.low_cap_exposure >= 45) return "Micro-Cap Hunter";
  if (p.meme_exposure >= 55) return "Meme Speculator";
  if (p.token_diversity >= 60) return "Diversified Trader";
  return "Long-Term Holder";
}

export function walletScore(w: Wallet, p: ReturnType<typeof buildTradingProfile>) {
  let s = 55;
  s -= p.meme_exposure * 0.28;
  s -= p.low_cap_exposure * 0.22;
  s += Math.min(p.token_diversity, 60) * 0.35;
  if (w.total_usd > 50_000) s += 10;
  if (w.sol_balance > 10) s += 6;
  return Math.max(2, Math.min(98, Math.round(s)));
}

export function detectPatterns(w: Wallet, p: ReturnType<typeof buildTradingProfile>) {
  const out: string[] = [];
  if (p.low_cap_exposure >= 30) out.push("Frequent low-cap trading");
  if (p.meme_exposure >= 45) out.push("Heavy meme exposure");
  const total = w.total_usd || 1;
  if (w.holdings.length && w.holdings[0].value_usd / total > 0.5) out.push("Concentrated holdings");
  if (w.token_count > 400) out.push("High transaction frequency");
  if (w.sol_balance > 40) out.push("Large unrealized SOL position");
  if (p.token_diversity >= 60) out.push("Broad token diversification");
  if (out.length === 0) out.push("Low-activity, stable footprint");
  return out;
}

export function gremsTake(w: Wallet, p: ReturnType<typeof buildTradingProfile>, trader: string, patterns: string[]) {
  const exposure = p.meme_exposure >= 55 ? "strong" : p.meme_exposure >= 30 ? "notable" : "limited";
  const lead: Record<string, string> = {
    Whale: "This is a heavyweight wallet.",
    "High-Frequency Trader": "This wallet trades relentlessly.",
    "Micro-Cap Hunter": "This wallet hunts the smallest caps.",
    "Meme Speculator": "This wallet lives on meme velocity.",
    "Diversified Trader": "This wallet spreads its bets wide.",
    "Long-Term Holder": "This wallet moves slowly and deliberately.",
  };
  const tail = patterns.length ? patterns[0].toLowerCase() : "a quiet footprint";
  return `${lead[trader] ?? "This wallet has a distinct signature."} GREM sees ${exposure} exposure to speculative Solana assets, with behaviour consistent with a ${trader.toLowerCase()}. The dominant pattern is ${tail}. Read these as behavioural signals from on-chain activity — not financial advice.`;
}

export function analyze(w: Wallet) {
  const profile = buildTradingProfile(w);
  const trader = classifyTrader(w, profile);
  const score = walletScore(w, profile);
  const patterns = detectPatterns(w, profile);
  const take = gremsTake(w, profile, trader, patterns);

  const total = w.total_usd || 1;
  const allocation: { symbol: string; value_usd: number; percent: number }[] = [];
  if (w.sol_value_usd) allocation.push({ symbol: "SOL", value_usd: w.sol_value_usd, percent: Math.round(pct(w.sol_value_usd, total) * 10) / 10 });
  for (const h of (w.holdings as any[]).slice(0, 6)) {
    allocation.push({ symbol: h.symbol, value_usd: h.value_usd, percent: Math.round(pct(h.value_usd, total) * 10) / 10 });
  }

  return {
    trading_profile: profile,
    portfolio: {
      total_usd: w.total_usd,
      sol_balance: w.sol_balance,
      sol_value_usd: w.sol_value_usd,
      token_count: w.token_count,
      allocation,
    },
    intelligence: { wallet_score: score, trader_profile: trader, patterns, grems_take: take },
  };
}
