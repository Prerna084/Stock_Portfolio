import React from "react";

export default function ComparisonTable({ symbol, rows }) {
  if (!rows) {
    return <div className="text-sm text-gray-500">No data yet — try Refresh.</div>;
  }

  const sources = rows.map((r) => r.source || r.name || "unknown");

  const metric = (r) => {
    if (r.error) return { price: "—", priceUSD: null, change: "—", timestamp: "error" };
    const priceUSD = r.price != null ? Number(r.price).toFixed(2) : null;
    const priceINR = r.price_inr != null ? Number(r.price_inr).toFixed(2) : null;
    return {
      price: priceINR != null ? `₹${priceINR}` : priceUSD != null ? `$${priceUSD}` : "—",
      priceUSD,
      change: r.change != null ? `${Number(r.change).toFixed(2)}%` : "—",
      timestamp: r.timestamp || "—",
    };
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr>
            <th className="px-3 py-2">Metric</th>
            {sources.map((s) => (
              <th key={s} className="px-3 py-2">
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-gray-800">
            <td className="px-3 py-2 font-medium">Price (INR)</td>
            {rows.map((r, i) => (
              <td key={i} className="px-3 py-2">
                <div>{metric(r).price}</div>
                {metric(r).priceUSD && (
                  <div className="text-xs text-gray-400">USD ${metric(r).priceUSD}</div>
                )}
              </td>
            ))}
          </tr>

          <tr className="border-t border-gray-800">
            <td className="px-3 py-2 font-medium">Change</td>
            {rows.map((r, i) => (
              <td key={i} className="px-3 py-2">
                {metric(r).change}
              </td>
            ))}
          </tr>

          <tr className="border-t border-gray-800">
            <td className="px-3 py-2 font-medium">Timestamp</td>
            {rows.map((r, i) => (
              <td key={i} className="px-3 py-2 text-xs text-gray-400">
                {metric(r).timestamp}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
