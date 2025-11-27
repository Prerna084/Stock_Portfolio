import * as google from "./googleFinance";
import * as yahoo from "./yahooFinance";
import * as bloomberg from "./bloomberg";
import * as alpha from "./alphaVantage";
import * as finnhub from "./finnhub";
import { getUSDtoINR } from "../currency";

// Export the list of providers — adapters should expose `name` and `fetchForSymbol`.
const providersBase = [google, yahoo, bloomberg];

// Conditionally include real providers when API keys are provided via Vite env vars.
const providers = [...providersBase];
const useProxy = import.meta.env.VITE_USE_PROXY === 'true';

// Include real providers when either client API key is present or the proxy is enabled.
if (import.meta.env.VITE_ALPHAVANTAGE_KEY || useProxy) providers.push(alpha);
if (import.meta.env.VITE_FINNHUB_KEY || useProxy) providers.push(finnhub);

export { providers };

export async function fetchAllForSymbol(symbol) {
  // Query all providers in parallel and collect results
  const promises = providers.map(async (p) => {
    try {
      const data = await p.fetchForSymbol(symbol);
      return { ...data, source: p.name };
    } catch (err) {
      return { source: p.name, error: err?.message || String(err) };
    }
  });

  const results = await Promise.all(promises);
  // Convert numeric prices (assumed USD) to INR for display convenience
  try {
    const rate = await getUSDtoINR();
    return results.map((r) => {
      if (!r) return r;
      // If server already provided INR, prefer it. Otherwise compute from numeric price.
      if (typeof r.price_inr === 'number') return r;
      if (typeof r.price === 'number') return { ...r, price_inr: Number((r.price * rate).toFixed(2)) };
      return r;
    });
  } catch (err) {
    return results;
  }
}
