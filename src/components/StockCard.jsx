import React from "react";
import { formatUSDToINRSync } from "../services/currency";

export default function StockCard({ symbol, name, price, change, priceClass = 'text-black' }) {
  const isNegative = String(change || "").includes("-");

  // Determine displayed price: accept either a preformatted string, a numeric USD value,
  // or an object with price_inr.
  let displayPrice = null;
  if (price && typeof price === "string") displayPrice = price;
  else if (price && typeof price === "number") displayPrice = formatUSDToINRSync(price) || `$${price.toFixed(2)}`;
  else displayPrice = "—";

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex justify-between items-center">
      <div>
        <p className="text-sm opacity-70">{symbol}</p>
        <h3 className="font-semibold text-lg">{name}</h3>
      </div>
      <div className="text-right">
        <p className={`font-bold ${priceClass}`}>{displayPrice}</p>
        <p className={isNegative ? "text-red-400" : "text-green-400"}>
          {change}
        </p>
      </div>
    </div>
  );
}
