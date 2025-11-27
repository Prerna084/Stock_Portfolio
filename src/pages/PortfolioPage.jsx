import React from "react";
import StatCard from "../components/StatCard";

const holdings = [
  { symbol: "AAPL", name: "Apple Inc.", qty: 20, avg: 150.2, ltp: 178.72 },
  { symbol: "GOOGL", name: "Alphabet Inc.", qty: 10, avg: 125.0, ltp: 132.45 },
  { symbol: "TSLA", name: "Tesla Inc.", qty: 5, avg: 220.0, ltp: 254.19 },
  { symbol: "AMZN", name: "Amazon Inc.", qty: 8, avg: 130.5, ltp: 138.91 },
];

import { formatUSDToINRSync, getUSDtoINR, getCachedRate } from "../services/currency";

function formatINR(n) {
  if (n == null) return "—";
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n);
}

export default function PortfolioPage() {
  const [rate, setRate] = React.useState(getCachedRate() || null);

  React.useEffect(() => {
    if (!rate) {
      getUSDtoINR().then((r) => setRate(r)).catch(() => {});
    }
  }, [rate]);

  // Compute numeric totals in INR when possible. If rate is not available yet,
  // fall back to USD-based calculation but formatting will still show USD fallback.
  const investedINR = holdings.reduce((sum, h) => sum + h.qty * h.avg * (rate || 1), 0);
  const currentINR = holdings.reduce((sum, h) => sum + h.qty * h.ltp * (rate || 1), 0);
  const pnlINR = currentINR - investedINR;
  const pnlPct = investedINR ? (pnlINR / investedINR) * 100 : 0;
  const positive = pnlINR >= 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-100">Portfolio</h2>
        <p className="text-sm text-gray-400">Overview of your holdings and performance.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Current Value" value={formatINR(currentINR)} />
        <StatCard title="Invested" value={formatINR(investedINR)} />
        <StatCard
          title="P/L"
          value={`${formatINR(Math.abs(pnlINR))}`}
          delta={`${pnlPct >= 0 ? "+" : "-"}${Math.abs(pnlPct).toFixed(2)}%`}
          positive={positive}
        />
      </div>

      {/* Holdings table */}
      <div className="card p-4">
        <div className="card-header mb-3">
          <h3 className="text-sm font-medium text-gray-200">Holdings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
                <th>Symbol</th>
                <th>Name</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Avg</th>
                <th className="text-right">LTP</th>
                <th className="text-right">P/L</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const rowPnl = h.qty * (h.ltp - h.avg);
                const neg = rowPnl < 0;
                return (
                  <tr key={h.symbol} className="[&>td]:px-3 [&>td]:py-2">
                    <td className="font-medium text-gray-700">{h.symbol}</td>
                    <td className="text-gray-400">{h.name}</td>
                    <td className="text-right text-gray-700">{h.qty}</td>
                    <td className="text-right text-black">{formatINR(h.avg * (rate || 1))}</td>
                    <td className="text-right text-black">{formatINR(h.ltp * (rate || 1))}</td>
                    <td className="text-right">
                      <span className={neg ? "chip-red" : "chip-green"}>
                        {neg ? "-" : "+"}
                        <span className="text-black">{formatINR(Math.abs(rowPnl) * (rate || 1))}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* Totals */}
              <tr className="[&>td]:px-3 [&>td]:py-2 font-medium">
                <td colSpan={3}></td>
                <td className="text-right text-gray-400">Invested</td>
                <td className="text-right text-gray-400">Current</td>
                <td className="text-right text-gray-400">Net P/L</td>
              </tr>
              <tr className="[&>td]:px-3 [&>td]:py-2 font-semibold">
                <td colSpan={3}></td>
                <td className="text-right text-black">{formatINR(investedINR)}</td>
                <td className="text-right text-black">{formatINR(currentINR)}</td>
                <td className="text-right">
                  <span className={positive ? "chip-green" : "chip-red"}>
                    {positive ? "+" : "-"}
                    <span className="text-black">{formatINR(Math.abs(pnlINR))}</span> ({`${positive ? "+" : "-"}${Math.abs(pnlPct).toFixed(2)}%`})
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
