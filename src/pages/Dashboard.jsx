import React from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Upload, Download } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";

export default function Dashboard() {
  const stocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 178.72, change: "+1.32%" },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 132.45, change: "-0.85%" },
    { symbol: "TSLA", name: "Tesla Inc.", price: 254.19, change: "+2.10%" },
    { symbol: "AMZN", name: "Amazon Inc.", price: 138.91, change: "-0.42%" },
  ];

  const performanceData = [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 35 },
    { month: "Mar", value: 30 },
    { month: "Apr", value: 50 },
    { month: "May", value: 45 },
    { month: "Jun", value: 60 },
  ];

  const portfolioValue = 228000.47;
  const dayChangeAbs = 3.21;
  const dayChangePct = 1.42;
  const isPositive = dayChangePct >= 0;

  return (
    <div className="space-y-6">
      {/* Portfolio summary */}
      <div className="card p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">Portfolio value</p>
            <div className="mt-1 text-3xl font-semibold text-gray-100">
              ${portfolioValue.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className={isPositive ? "chip-green" : "chip-red"}>
                {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {isPositive ? "+" : "-"}
                {Math.abs(dayChangePct).toFixed(2)}% (${Math.abs(dayChangeAbs).toFixed(2)})
              </span>
              <span className="chip-neutral">Today</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trade
            </button>
            <button className="btn-outline">
              <Download className="h-4 w-4 mr-2" />
              Deposit
            </button>
            <button className="btn-outline">
              <Upload className="h-4 w-4 mr-2" />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="1D Change" value={`${isPositive ? "+" : "-"}${Math.abs(dayChangePct)}%`} delta={`$${Math.abs(dayChangeAbs)}`} positive={isPositive} />
        <StatCard title="Total Returns" value="$12,430.00" delta="+5.8%" positive />
        <StatCard title="Holdings" value="24" delta="+2 Today" positive />
        <StatCard title="Cash Balance" value="$8,540.00" />
      </div>

      {/* Performance chart */}
      <ChartCard title="Performance" subtitle="Last 6 months">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={performanceData}>
            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Watchlist */}
      <div className="card p-4">
        <div className="card-header mb-3">
          <h3 className="text-sm font-medium text-gray-200">Watchlist</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="[&>th]:px-3 [&>th]:py-2 text-left">
                <th>Symbol</th>
                <th>Name</th>
                <th className="text-right">Price</th>
                <th className="text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s) => {
                const neg = s.change.includes("-");
                return (
                  <tr key={s.symbol} className="[&>td]:px-3 [&>td]:py-2">
                    <td className="font-medium">{s.symbol}</td>
                    <td className="text-gray-400">{s.name}</td>
                    <td className="text-right font-medium">${s.price.toFixed(2)}</td>
                    <td className="text-right">
                      <span className={neg ? "chip-red" : "chip-green"}>
                        {neg ? <ArrowDownRight className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1" />}
                        {s.change}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
