export const name = "Alpha Vantage";

export async function fetchForSymbol(symbol) {
  const useProxy = import.meta.env.VITE_USE_PROXY === "true";
  const proxyBase = import.meta.env.VITE_PROXY_URL || "http://localhost:4000";

  if (useProxy) {
    const url = `${proxyBase}/api/alpha/quote?symbol=${encodeURIComponent(symbol)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`AlphaVantage proxy request failed: ${res.status}`);
    const json = await res.json();
    if (json.Note) throw new Error("AlphaVantage rate limit or note: " + json.Note);
    if (json['Error Message']) throw new Error("AlphaVantage error: " + json['Error Message']);
    // If server provided an adapted object (including INR conversion), prefer it
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

    const g = json['Global Quote'] || {};
    const price = g['05. price'] ? Number(g['05. price']) : null;
    const changePercentRaw = g['10. change percent'] || null;
    const change = changePercentRaw ? Number(String(changePercentRaw).replace('%', '')) : null;
    const timestamp = g['07. latest trading day'] || new Date().toISOString();

    return { symbol, price, change, timestamp };
  }

  const key = import.meta.env.VITE_ALPHAVANTAGE_KEY;
  if (!key) throw new Error("Alpha Vantage API key not configured (VITE_ALPHAVANTAGE_KEY) or enable proxy (VITE_USE_PROXY=true)");

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`AlphaVantage request failed: ${res.status}`);

  const json = await res.json();
  if (json.Note) throw new Error("AlphaVantage rate limit or note: " + json.Note);
  if (json['Error Message']) throw new Error("AlphaVantage error: " + json['Error Message']);

  const g = json['Global Quote'] || {};
  const price = g['05. price'] ? Number(g['05. price']) : null;
  const changePercentRaw = g['10. change percent'] || null;
  const change = changePercentRaw ? Number(String(changePercentRaw).replace('%', '')) : null;
  const timestamp = g['07. latest trading day'] || new Date().toISOString();

  return { symbol, price, change, timestamp };
}
