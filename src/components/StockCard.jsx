import React from "react";

export default function StockCard({ symbol, name, price, change }) {
  const isNegative = change.includes("-");

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg flex justify-between items-center">
      <div>
        <p className="text-sm opacity-70">{symbol}</p>
        <h3 className="font-semibold text-lg">{name}</h3>
      </div>
      <div className="text-right">
        <p className="font-bold">${price}</p>
        <p className={isNegative ? "text-red-400" : "text-green-400"}>
          {change}
        </p>
      </div>
    </div>
  );
}
