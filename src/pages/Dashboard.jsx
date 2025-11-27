import React, { useState, useEffect } from "react";
import { // eslint-disable-line
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "../components/StatCard";
import StockCard from "../components/StockCard";

const data = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 800 },
  { name: "Wed", value: 600 },
  { name: "Thu", value: 1200 },
  { name: "Fri", value: 900 },
  { name: "Sat", value: 1500 },
];

const pieData = [
  { name: "Stocks", value: 65 },
  { name: "Bonds", value: 20 },
  { name: "Crypto", value: 15 },
];

const COLORS = ["#4f46e5", "#10b981", "#f59e0b"];

export default function Dashboard() {
  const [topGainers, setTopGainers] = useState([]);
  const [loadingGainers, setLoadingGainers] = useState(true);
  const [gainersError, setGainersError] = useState(null);

  const [topLosers, setTopLosers] = useState([]);
  const [loadingLosers, setLoadingLosers] = useState(true);
  const [losersError, setLosersError] = useState(null);

  useEffect(() => {
    // Generic fetch function for our stock lists
    const fetchStockData = async (
      endpoint,
      setData,
      setLoading,
      setError
    ) => {
      try {
        // We assume you have a proxy setup to forward requests to the Finnhub API
        // e.g., '/api/gainers' -> 'https://your-backend-or-finnhub-logic'
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Taking the top 5 results from the API
        setData(data.slice(0, 5));
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch from ${endpoint}:`, err);
        setError("Failed to load data.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch both gainers and losers
    fetchStockData(
      "/api/gainers",
      setTopGainers,
      setLoadingGainers,
      setGainersError
    );
    fetchStockData(
      "/api/losers",
      setTopLosers,
      setLoadingLosers,
      setLosersError
    );
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="space-y-10">
      {/* ====== Header ====== */}
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      {/* ====== Stat Cards ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Portfolio Value"
          value="₹1,25,000"
          icon={<TrendingUp className="text-green-400" />}
        />
        <StatCard
          title="Invested Amount"
          value="₹1,00,000"
          icon={<Upload className="text-blue-400" />}
        />
        <StatCard
          title="Returns"
          value="+₹25,000"
          icon={<ArrowUpRight className="text-green-400" />}
        />
        <StatCard
          title="Withdrawn"
          value="₹5,000"
          icon={<Download className="text-red-400" />}
        />
      </div>

      {/* ====== Charts Section ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="col-span-2 bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Portfolio Growth</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Asset Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ====== Top Gainers & Losers ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-green-400">
            Top Gainers
          </h2>
          <div className="space-y-3">
            {loadingGainers ? (
              <p className="text-gray-400">Loading...</p>
            ) : gainersError ? (
              <p className="text-red-400">{gainersError}</p>
            ) : (
              topGainers.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  name={stock.name}
                  price={`${stock.currency === 'INR' ? '₹' : '$'}${stock.price.toFixed(2)}`}
                  change={`+${stock.changesPercentage.toFixed(2)}%`}
                  type="gainer"
                  priceClass="text-green-400"
                />
              ))
            )}
            {!loadingGainers &&
              !gainersError &&
              topGainers.length === 0 && (
                <p className="text-gray-400">No gainers data available.</p>
              )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-red-400">
            Top Losers
          </h2>
          <div className="space-y-3">
            {loadingLosers ? (
              <p className="text-gray-400">Loading...</p>
            ) : losersError ? (
              <p className="text-red-400">{losersError}</p>
            ) : (
              topLosers.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  name={stock.name}
                  price={`${stock.currency === 'INR' ? '₹' : '$'}${stock.price.toFixed(2)}`}
                  // Losers' change is negative, so we don't add a '+'
                  change={`${stock.changesPercentage.toFixed(2)}%`}
                  type="loser"
                  priceClass="text-red-400"
                />
              ))
            )}
            {!loadingLosers &&
              !losersError &&
              topLosers.length === 0 && (
                <p className="text-gray-400">No losers data available.</p>
              )}
          </div>
        </div>
      </div>

      {/* ====== Extra Dashboard Section (from your 1st version) ====== */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow space-y-6 theme-card">
        <h2 className="text-xl font-semibold text-white theme-heading">Best Prices to Buy</h2>
        <table className="w-full text-left text-gray-300">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2">Stock</th>
              <th>Price</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Reliance", price: "₹2,400", rec: "Buy" },
              { name: "ICICI Bank", price: "₹960", rec: "Hold" },
              { name: "Tech Mahindra", price: "₹1,350", rec: "Buy" },
            ].map((s) => (
              <tr key={s.name} className="border-b border-gray-700">
                <td className="py-2">{s.name}</td>
                <td>{s.price}</td>
                <td
                  className={`${
                    s.rec === "Buy"
                      ? "text-emerald-400"
                      : s.rec === "Hold"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {s.rec}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
