import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Repeat,
  Upload,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const stocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 178.72, change: "+1.32%" },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 132.45, change: "-0.85%" },
    { symbol: "TSLA", name: "Tesla Inc.", price: 254.19, change: "+2.10%" },
    { symbol: "AMZN", name: "Amazon Inc.", price: 138.91, change: "-0.42%" },
  ];

  // Fake portfolio performance data
  const performanceData = [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 35 },
    { month: "Mar", value: 30 },
    { month: "Apr", value: 50 },
    { month: "May", value: 45 },
    { month: "Jun", value: 60 },
  ];

  // State for actions
  const [activeAction, setActiveAction] = useState(null);

  return (
    <div className="space-y-6">
      {/* Portfolio Card */}
      <div className="bg-green-500 text-black rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-medium">Value • Performance</h2>
        <p className="text-3xl font-bold">$228,000.47</p>
        <p className="text-sm text-gray-900 flex items-center">
          +$3.21 (1.42%)
          <ArrowUpRight className="ml-2 w-4 h-4" />
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <button
            onClick={() => setActiveAction(activeAction === "trade" ? null : "trade")}
            className="flex flex-col items-center p-2 rounded-xl bg-black/10 hover:bg-black/20"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs mt-1">Trade</span>
          </button>
          <button
            onClick={() =>
              setActiveAction(activeAction === "transactions" ? null : "transactions")
            }
            className="flex flex-col items-center p-2 rounded-xl bg-black/10 hover:bg-black/20"
          >
            <Repeat className="w-5 h-5" />
            <span className="text-xs mt-1">Transactions</span>
          </button>
          <button
            onClick={() =>
              setActiveAction(activeAction === "withdraw" ? null : "withdraw")
            }
            className="flex flex-col items-center p-2 rounded-xl bg-black/10 hover:bg-black/20"
          >
            <Upload className="w-5 h-5" />
            <span className="text-xs mt-1">Withdraw</span>
          </button>
          <button
            onClick={() =>
              setActiveAction(activeAction === "deposit" ? null : "deposit")
            }
            className="flex flex-col items-center p-2 rounded-xl bg-black/10 hover:bg-black/20"
          >
            <Download className="w-5 h-5" />
            <span className="text-xs mt-1">Deposit</span>
          </button>
        </div>
      </div>

      {/* Action Content Section */}
      {activeAction === "trade" && (
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-green-400 mb-4">📈 Trade Stocks</h3>
          <div className="space-y-3">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                className="flex justify-between items-center border-b border-gray-700 pb-2"
              >
                <span>{stock.name} ({stock.symbol})</span>
                <span className="font-bold">${stock.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAction === "transactions" && (
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-green-400 mb-4">🔄 Recent Transactions</h3>
          <p className="text-gray-400">No recent transactions.</p>
        </div>
      )}

      {activeAction === "withdraw" && (
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-green-400 mb-4">⬆️ Withdraw Funds</h3>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full p-2 rounded bg-gray-800 text-white mb-3"
          />
          <button className="bg-green-500 text-black px-4 py-2 rounded-lg">
            Withdraw
          </button>
        </div>
      )}

      {activeAction === "deposit" && (
        <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-green-400 mb-4">⬇️ Deposit Funds</h3>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full p-2 rounded bg-gray-800 text-white mb-3"
          />
          <button className="bg-green-500 text-black px-4 py-2 rounded-lg">
            Deposit
          </button>
        </div>
      )}

      {/* Performance Graph */}
      <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📊 Performance</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={performanceData}>
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Watchlist */}
      <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">👀 Watchlist</h2>
        <div className="space-y-4">
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex justify-between items-center border-b border-gray-700 pb-3"
            >
              <div>
                <p className="font-bold">{stock.symbol}</p>
                <p className="text-gray-400 text-sm">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${stock.price.toFixed(2)}</p>
                <p
                  className={`text-sm flex items-center justify-end ${
                    stock.change.includes("+")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {stock.change.includes("+") ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {stock.change}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
