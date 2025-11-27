import express from 'express';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Simple in-memory cache for FX rate (USD -> INR)
let fxRate = null;
let fxFetchedAt = 0;
async function getFXRate() {
  const ttl = 1000 * 60 * 5; // 5 minutes
  const now = Date.now();
  if (fxRate && now - fxFetchedAt < ttl) return fxRate;

  const providers = [
    'https://api.exchangerate.host/latest?base=USD&symbols=INR',
    'https://open.er-api.com/v6/latest/USD',
  ];

  for (const url of providers) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn('FX provider failed', url, response.status);
        continue;
      }
      const json = await response.json();
      const rate =
        json?.rates?.INR ??
        json?.conversion_rates?.INR ??
        json?.rates?.INR;
      if (!rate) {
        console.warn('FX provider missing INR rate', url);
        continue;
      }
      fxRate = Number(rate);
      fxFetchedAt = now;
      return fxRate;
    } catch (err) {
      console.warn('FX provider error', url, err?.message || err);
    }
  }

  console.error('FX fetch error: all providers failed');
  return fxRate || 1; // fallback to last known rate or 1
}

// Simple CORS middleware: allow local dev frontends to call the proxy.
// For production, restrict origins appropriately.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Basic rate limiter to avoid accidental abuse while developing
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
});
app.use(limiter);

app.get('/', (req, res) => res.send('SnapInvest proxy running'));

const mockMarketData = {
  gainers: [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2850.23, changesPercentage: 2.15 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1675.56, changesPercentage: 1.82 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3804.11, changesPercentage: 1.35 },
    { symbol: 'INFY', name: 'Infosys', price: 1520.9, changesPercentage: 1.12 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1040.35, changesPercentage: 0.97 },
  ],
  losers: [
    { symbol: 'ADANIPORTS', name: 'Adani Ports', price: 1132.78, changesPercentage: -1.46 },
    { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv', price: 1685.44, changesPercentage: -1.22 },
    { symbol: 'SUNPHARMA', name: 'Sun Pharma', price: 1491.01, changesPercentage: -1.05 },
    { symbol: 'POWERGRID', name: 'Power Grid', price: 263.34, changesPercentage: -0.88 },
    { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', price: 9655.2, changesPercentage: -0.77 },
  ],
};

const fallbackSymbols = [
  { symbol: 'RELIANCE', name: 'Reliance Industries' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank' },
  { symbol: 'TCS', name: 'Tata Consultancy Services' },
  { symbol: 'INFY', name: 'Infosys' },
  { symbol: 'SBIN', name: 'State Bank of India' },
  { symbol: 'LT', name: 'Larsen & Toubro' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma' },
  { symbol: 'ITC', name: 'ITC' },
];

// Shared helper for Financial Modeling Prep stock market endpoints (with graceful fallback)
async function fetchFmpMarket(endpoint) {
  const apiKey = process.env.FMP_KEY || process.env.FMP_API_KEY;
  if (!apiKey) {
    console.warn('FMP key missing; serving mock %s data', endpoint);
    return mockMarketData[endpoint] || [];
  }

  const url = `https://financialmodelingprep.com/api/v3/stock_market/${endpoint}?apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const body = await response.text();
      if (response.status === 401 || response.status === 403) {
        console.warn(
          'FMP rejected %s request with %s. Serving mock data instead.',
          endpoint,
          response.status
        );
        return mockMarketData[endpoint] || [];
      }
      throw new Error(`FMP request failed (${response.status}): ${body || response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    console.warn('FMP request error (%s). Serving mock %s data. %s', url, endpoint, err?.message || err);
    return mockMarketData[endpoint] || [];
  }
}

async function adaptStocksWithInr(data = []) {
  const rate = await getFXRate();
  return data.map((stock) => {
    const priceUSD = Number(stock?.price ?? 0);
    if (!Number.isFinite(priceUSD)) return stock;
    const priceINR = Number((priceUSD * rate).toFixed(2));
    return {
      ...stock,
      priceUSD,
      price: priceINR,
      currency: 'INR',
    };
  });
}

app.get('/api/gainers', async (req, res) => {
  try {
    const data = await fetchFmpMarket('gainers');
    const adapted = await adaptStocksWithInr(data);
    res.json(adapted);
  } catch (err) {
    console.error('Gainers proxy error', err?.stack || err);
    res.status(502).json({ error: err?.message || String(err) });
  }
});

app.get('/api/losers', async (req, res) => {
  try {
    const data = await fetchFmpMarket('losers');
    const adapted = await adaptStocksWithInr(data);
    res.json(adapted);
  } catch (err) {
    console.error('Losers proxy error', err?.stack || err);
    res.status(502).json({ error: err?.message || String(err) });
  }
});

app.get('/api/search/symbols', async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) return res.json([]);

  const take = (list = []) => list.slice(0, 5);

  try {
    if (process.env.FINNHUB_KEY) {
      const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&token=${process.env.FINNHUB_KEY}`;
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        const mapped =
          json?.result?.map((item) => ({
            symbol: item.symbol,
            name: item.description,
            type: item.type,
          })) || [];
        if (mapped.length) return res.json(take(mapped));
      } else {
        console.warn('Finnhub search error', response.status);
      }
    }

    if (process.env.ALPHAVANTAGE_KEY) {
      const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${process.env.ALPHAVANTAGE_KEY}`;
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        const matches = json?.bestMatches || [];
        const mapped = matches.map((match) => ({
          symbol: match['1. symbol'],
          name: match['2. name'],
          region: match['4. region'],
        }));
        if (mapped.length) return res.json(take(mapped));
      } else {
        console.warn('AlphaVantage search error', response.status);
      }
    }

    const fallback = fallbackSymbols
      .filter((item) => item.symbol.toLowerCase().startsWith(query.toLowerCase()) || item.name.toLowerCase().includes(query.toLowerCase()));
    return res.json(take(fallback));
  } catch (err) {
    console.error('Symbol search error', err?.stack || err);
    const fallback = fallbackSymbols.filter((item) =>
      item.symbol.toLowerCase().startsWith(query.toLowerCase()) || item.name.toLowerCase().includes(query.toLowerCase())
    );
    return res.json(take(fallback));
  }
});

// Proxy Alpha Vantage: /api/alpha/quote?symbol=AAPL
app.get('/api/alpha/quote', async (req, res) => {
  const symbol = req.query.symbol;
  const key = process.env.ALPHAVANTAGE_KEY;
  if (!key) return res.status(500).json({ error: 'AlphaVantage key not configured' });
  if (!symbol) return res.status(400).json({ error: 'Missing symbol' });

  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;
  try {
    const r = await fetch(url);
    const json = await r.json();
    // Add server-side adapted fields including INR conversion when possible
    try {
      const rate = await getFXRate();
      const g = json['Global Quote'] || {};
      const price = g['05. price'] ? Number(g['05. price']) : null;
      const changePercentRaw = g['10. change percent'] || null;
      const change = changePercentRaw ? Number(String(changePercentRaw).replace('%', '')) : null;
      const timestamp = g['07. latest trading day'] || new Date().toISOString();
      if (price != null) {
        json.adapted = {
          symbol,
          price,
          price_inr: Number((price * rate).toFixed(2)),
          change,
          timestamp,
        };
      }
    } catch (e) {
      console.error('Alpha adapt error', e?.stack || e);
    }
    return res.json(json);
  } catch (err) {
    console.error('Alpha proxy error', err?.stack || err);
    return res.status(502).json({ error: err?.message || String(err) });
  }
});

// Proxy Finnhub: /api/finnhub/quote?symbol=AAPL
app.get('/api/finnhub/quote', async (req, res) => {
  const symbol = req.query.symbol;
  const key = process.env.FINNHUB_KEY;
  if (!key) return res.status(500).json({ error: 'Finnhub key not configured' });
  if (!symbol) return res.status(400).json({ error: 'Missing symbol' });

  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`;
  try {
    const r = await fetch(url);
    const json = await r.json();
    try {
      const rate = await getFXRate();
      const price = json.c ?? null;
      const change = json.dp ?? null;
      const timestamp = json.t ? new Date(json.t * 1000).toISOString() : new Date().toISOString();
      if (price != null) {
        json.adapted = {
          symbol,
          price,
          price_inr: Number((price * rate).toFixed(2)),
          change,
          timestamp,
        };
      }
    } catch (e) {
      console.error('Finnhub adapt error', e?.stack || e);
    }
    return res.json(json);
  } catch (err) {
    console.error('Finnhub proxy error', err?.stack || err);
    return res.status(502).json({ error: err?.message || String(err) });
  }
});

app.listen(port, () => console.log(`Proxy server listening on http://localhost:${port}`));

// Global error handler to ensure CORS headers on errors and better logging
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err?.stack || err);
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal server error', detail: String(err?.message || err) });
});
