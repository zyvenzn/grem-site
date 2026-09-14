const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

async function getJSON<T = any>(path: string): Promise<T> {
  let res: Response;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    res = await fetch(`${BASE}${path}`, { headers: { accept: "application/json" }, signal: ctrl.signal });
  } catch {
    clearTimeout(timer);
    throw new ApiError(0, "network_error");
  }
  clearTimeout(timer);
  if (!res.ok) {
    let code = `http_${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) code = body.detail;
    } catch {}
    throw new ApiError(res.status, code);
  }
  return res.json();
}

export const api = {
  health: () => getJSON("/api/health"),
  wallet: (address: string) => getJSON(`/api/wallet/${encodeURIComponent(address)}`),
  token: (mint: string) => getJSON(`/api/token/${encodeURIComponent(mint)}`),
  intelligence: (address: string) => getJSON(`/api/intelligence/${encodeURIComponent(address)}`),
  tokens: (params: Record<string, string | number | boolean | undefined>) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== false) qs.set(k, String(v));
    });
    return getJSON(`/api/tokens?${qs.toString()}`);
  },
};
