import React, { useEffect, useState } from "react";
import { fetchAllForSymbol, providers as activeProviders } from "../services/dataProviders";
import ComparisonTable from "../components/Analytics/ComparisonTable";

export default function Analytics() {
  const [symbols, setSymbols] = useState(["AAPL", "MSFT", "TSLA"]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    // load default symbols on mount
    handleFetch(symbols);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleFetch(list) {
    setLoading(true);
    setError(null);
    const out = {};
    try {
      await Promise.all(
        list.map(async (s) => {
          const data = await fetchAllForSymbol(s);
          out[s] = data;
        })
      );
      setResults(out);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  function handleAddSymbol(e) {
    e.preventDefault();
    const s = query.trim().toUpperCase();
    if (!s) return;
    if (symbols.includes(s)) {
      setQuery("");
      return;
    }
    const next = [...symbols, s];
    setSymbols(next);
    setQuery("");
    handleFetch(next);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Market Analytics</h1>

      <div className="mb-4 text-sm text-gray-300">
        <strong>Active sources:</strong>{' '}
        {activeProviders && activeProviders.length > 0
          ? activeProviders.map((p) => p.name).join(', ')
          : 'none'}
      </div>

      <form onSubmit={handleAddSymbol} className="flex gap-2 mb-4">
        <input
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-white"
          placeholder="Add symbol (e.g. AAPL)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="px-4 py-2 bg-indigo-600 rounded" type="submit">
          Add
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-700 rounded"
          onClick={() => handleFetch(symbols)}
          disabled={loading}
        >
          Refresh
        </button>
      </form>

      {loading && <div className="text-sm text-gray-300 mb-3">Loading data…</div>}
      {error && <div className="text-red-400 mb-3">{error}</div>}

      <div className="space-y-6">
        {symbols.map((sym) => (
          <div key={sym} className="bg-gray-900 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">{sym}</h2>
            <ComparisonTable symbol={sym} rows={results[sym]} />
          </div>
        ))}
      </div>
    </div>
  );
}
