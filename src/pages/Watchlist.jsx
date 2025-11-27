import React, { useState } from "react";
import { formatUSDToINRSync } from "../services/currency";
import { fetchAllForSymbol } from "../services/dataProviders";

const initialWatchlist = [
  { symbol: "TCS", name: "TCS", priceUSD: 3250.45, change: 1.24 },
  { symbol: "INFY", name: "Infosys", priceUSD: 1420.1, change: -0.68 },
  { symbol: "RELIANCE", name: "Reliance Industries", priceUSD: 2340, change: 0.92 },
  { symbol: "HDFCBANK", name: "HDFC Bank", priceUSD: 1598.3, change: 0.45 },
];

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [symbolInput, setSymbolInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatINR = (value) => {
    if (value == null) return null;
    try {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
    } catch {
      return `₹${Number(value).toFixed(2)}`;
    }
  };

  const derivePriceLabel = (stock) => {
    if (typeof stock.priceINR === "number") {
      return formatINR(stock.priceINR);
    }
    if (typeof stock.priceUSD === "number") {
      return formatUSDToINRSync(stock.priceUSD) || `$${stock.priceUSD.toFixed(2)}`;
    }
    return "—";
  };

  async function fetchLiveQuote(symbol) {
    const providers = await fetchAllForSymbol(symbol);
    if (!providers || providers.length === 0) {
      throw new Error("No provider data returned");
    }

    const usable =
      providers.find((p) => typeof p?.price_inr === "number") ||
      providers.find((p) => typeof p?.price === "number");

    if (!usable) {
      throw new Error("Live data unavailable for this symbol");
    }

    return {
      symbol,
      name: usable.companyName || usable.symbol || symbol,
      priceUSD: typeof usable.price === "number" ? Number(usable.price) : null,
      priceINR: typeof usable.price_inr === "number" ? Number(usable.price_inr) : null,
      change: typeof usable.change === "number" ? Number(usable.change) : 0,
      source: usable.source,
      timestamp: usable.timestamp,
    };
  }

  const handleAddStock = async (e) => {
    e.preventDefault();
    const cleanSymbol = symbolInput.trim().toUpperCase();
    if (!cleanSymbol) return;
    if (watchlist.some((item) => item.symbol === cleanSymbol)) {
      setError(`${cleanSymbol} is already in your watchlist.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const quote = await fetchLiveQuote(cleanSymbol);
      setWatchlist((prev) => [...prev, quote]);
      setSymbolInput("");
    } catch (err) {
      setError(err?.message || "Failed to fetch stock data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Watchlist</h1>
          <p className="text-sm text-gray-400">
            Pull live quotes via your configured data providers or proxy.
          </p>
        </div>
        <form onSubmit={handleAddStock} className="flex w-full gap-2 md:w-auto">
          <input
            className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-500"
            placeholder="Enter symbol (e.g. AAPL)"
            value={symbolInput}
            onChange={(e) => setSymbolInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-primary whitespace-nowrap disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Adding…" : "+ Add Stock"}
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {watchlist.map((stock, i) => (
          <div key={`${stock.symbol}-${i}`} className="card flex items-center justify-between glow-card">
            <div>
              <h2 className="text-lg font-semibold text-gray-200">{stock.name || stock.symbol}</h2>
              <p className="text-gray-400 text-sm">{stock.symbol}</p>
              {stock.source && (
                <p className="text-xs text-gray-500">Source: {stock.source}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{derivePriceLabel(stock)}</p>
              <p
                className={`text-sm ${
                  (stock.change ?? 0) >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {(stock.change ?? 0) >= 0 ? "▲" : "▼"} {Math.abs(stock.change ?? 0).toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
