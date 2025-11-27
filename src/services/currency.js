let cachedRate = null;
let cachedAt = 0;

// Try to hydrate cached rate from localStorage so a reload keeps INR formatting.
try {
  const stored = localStorage.getItem('fx_usd_inr');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed?.rate) {
      cachedRate = Number(parsed.rate);
      cachedAt = Number(parsed.at) || 0;
    }
  }
} catch (e) {
  // ignore
}

// Get USD -> INR rate with simple in-memory caching (TTL 5 minutes)
export async function getUSDtoINR() {
  const ttl = 1000 * 60 * 5; // 5 minutes
  const now = Date.now();
  if (cachedRate && now - cachedAt < ttl) return cachedRate;

  try {
    // Try primary provider, then a fallback provider if needed.
    const providers = [
      'https://api.exchangerate.host/latest?base=USD&symbols=INR',
      'https://open.er-api.com/v6/latest/USD',
    ];

    let rate = null;
    for (const url of providers) {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.warn('currency.getUSDtoINR: provider fetch failed', url, res.status);
          continue;
        }
        const json = await res.json();
        // Support different response shapes
        rate = json?.rates?.INR || json?.conversion_rates?.INR || json?.rates?.INR;
        if (rate) break;
      } catch (e) {
        console.warn('currency.getUSDtoINR: provider request error', url, e?.message || e);
      }
    }

    if (!rate) {
      console.warn('currency.getUSDtoINR: INR rate not found in response; using cached/fallback rate');
      if (cachedRate) return cachedRate;
      rate = cachedRate || 1;
    }

    cachedRate = Number(rate);
    cachedAt = now;

    // persist for reloads
    try {
      localStorage.setItem('fx_usd_inr', JSON.stringify({ rate: cachedRate, at: cachedAt }));
    } catch (e) {
      // ignore storage errors
    }

    return cachedRate;
  } catch (err) {
    // Log a single warning (not noisy stack) and return a sensible fallback.
    console.warn('currency.getUSDtoINR error', err?.message || err);
    return cachedRate || 1;
  }
}

// Synchronous formatter that uses cached rate when available.
// If cached rate isn't available yet, it will return null so callers
// can fall back to USD formatting or trigger a background fetch.
export function formatUSDToINRSync(amount) {
  if (amount == null) return null;
  if (cachedRate) {
    const inr = Number((Number(amount) * cachedRate).toFixed(2));
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(inr);
  }
  return null;
}

// Async formatter: fetches rate if needed and returns INR string.
export async function formatUSDToINR(amount) {
  if (amount == null) return null;
  const rate = await getUSDtoINR();
  const inr = Number((Number(amount) * rate).toFixed(2));
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(inr);
}

// Expose cachedRate for diagnostics/tests (read-only)
export function getCachedRate() {
  return cachedRate;
}
