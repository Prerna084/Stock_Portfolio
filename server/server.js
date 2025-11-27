import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import 'dotenv/config'; // To use .env variables

const app = express();
const PORT = 4000;

// Use CORS to allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:5173' // Replace with your Vite dev server URL if different
}));

// --- New Function to Fetch FX Rate ---
async function getFxRate() {
  const apiKey = process.env.vite_FMP_API_KEY;
  if (!apiKey) {
    throw new Error('Financial Modeling Prep API key not configured (set vite_FMP_API_KEY)');
  }
  const url = `https://financialmodelingprep.com/api/v3/fx/USDINR?apikey=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('FX API response not OK');
    const data = await response.json();
    // FMP returns an array, we need the first item's rate
    if (data && data.length > 0 && data[0].rate) {
      return data[0].rate;
    }
    throw new Error('Invalid FX data format');
  } catch (error) {
    console.error('FX fetch error:', error.message);
    return null; // Return null on failure to indicate fallback
  }
}

// A generic function to proxy requests to the Financial Modeling Prep API
async function fetchFinancialData(endpoint) {
  const apiKey = process.env.FINNHUB_KEY;
  if (!apiKey) {
    throw new Error("API key is missing. Make sure it's in your .env file.");
  }

  const url = `https://financialmodelingprep.com/api/v3/stock_market/${endpoint}?apikey=${apiKey}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch from FMP API: ${response.statusText}. Body: ${errorBody}`);
  }
  return await response.json();
}

// Endpoint for Top Gainers
app.get('/gainers', async (req, res) => {
  try {
    const [data, fxRate] = await Promise.all([
      fetchFinancialData('gainers'),
      getFxRate()
    ]);

    // If we have an FX rate, convert prices. Otherwise, use default USD.
    if (fxRate) {
      data.forEach(stock => {
        stock.price = stock.price * fxRate;
        stock.currency = 'INR';
      });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint for Top Losers
app.get('/losers', async (req, res) => {
  try {
    const [data, fxRate] = await Promise.all([
      fetchFinancialData('losers'),
      getFxRate()
    ]);

    // If we have an FX rate, convert prices. Otherwise, use default USD.
    if (fxRate) {
      data.forEach(stock => {
        stock.price = stock.price * fxRate;
        stock.currency = 'INR';
      });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend server is running at http://localhost:${PORT}`);
});