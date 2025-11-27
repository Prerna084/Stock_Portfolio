export const name = "Finnhub";

export async function fetchForSymbol(symbol) {
  const useProxy = import.meta.env.VITE_USE_PROXY === "true";
  const proxyBase = import.meta.env.VITE_PROXY_URL || "http://localhost:4000";

  if (useProxy) {
    const url = `${proxyBase}/api/finnhub/quote?symbol=${encodeURIComponent(symbol)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Finnhub proxy request failed: ${res.status}`);
    const json = await res.json();
    if (json.adapted) {
      const a = json.adapted;
      return {
        symbol: a.symbol || symbol,
        price: typeof a.price === 'number' ? a.price : null,
        price_inr: typeof a.price_inr === 'number' ? a.price_inr : null,
        change: typeof a.change === 'number' ? a.change : null,
        timestamp: a.timestamp || null,
      };
    }

    const price = json.c ?? null;
    const change = json.dp ?? null;
    const timestamp = json.t ? new Date(json.t * 1000).toISOString() : new Date().toISOString();
    return { symbol, price, change, timestamp };
  }

  const key = import.meta.env.VITE_FINNHUB_KEY;
  if (!key) throw new Error("Finnhub API key not configured (VITE_FINNHUB_KEY) or enable proxy (VITE_USE_PROXY=true)");

  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Finnhub request failed: ${res.status}`);

  const json = await res.json();
  const price = json.c ?? null;
  const change = json.dp ?? null;
  const timestamp = json.t ? new Date(json.t * 1000).toISOString() : new Date().toISOString();

  return { symbol, price, change, timestamp };
}
