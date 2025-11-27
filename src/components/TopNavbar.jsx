import React, { useState, useEffect } from "react";
import { Bell, User, Search, Download, Upload } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchAllForSymbol } from "../services/dataProviders";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbar({ onDeposit, onWithdraw, onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Loading notifications..." },
  ]);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    // Symbols for which to fetch notifications. You could get this from user's watchlist.
    const symbols = ["TCS", "RELIANCE", "INFY"];

    const fetchNotifications = async () => {
      const newNotifications = [];
      let id = 1;

      for (const symbol of symbols) {
        try {
          const results = await fetchAllForSymbol(symbol);
          // Process results from any successful source (e.g., Google, Bloomberg, Yahoo, Finnhub)
          results.forEach(result => {
            if (!result.error) {
              if (result.price) {
                newNotifications.push({ id: id++, text: `${symbol} price is ${result.price} (${result.source})` });
              }
              if (result.change) {
                newNotifications.push({ id: id++, text: `${symbol} change is ${result.change}% (${result.source})` });
              }
            }
          });
        } catch (error) {
          console.error(`Error fetching notifications for ${symbol}:`, error);
        }
      }

      setNotifications(newNotifications.length > 0 ? newNotifications : [{ id: 1, text: "No new updates." }]);
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    setSearchLoading(true);

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/symbols?q=${encodeURIComponent(searchQuery.trim())}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);
        const data = await res.json();
        setSuggestions(data || []);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Search suggestion error", err);
        setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const handleSelectSuggestion = (item) => {
    setSearchQuery(item.symbol);
    setSuggestions([]);
    onSearch?.(item.symbol);
    navigate(`/watchlist?symbol=${encodeURIComponent(item.symbol)}`);
  };

  return (
    <div
      className={`flex justify-between items-center p-3 sticky top-0 z-50 transition-colors duration-200 ${
        isLight
          ? "bg-white border-b border-gray-200 text-gray-900"
          : "bg-[#111315] border-b border-neutral-800 text-gray-200"
      }`}
    >
      <h1 className="text-lg font-semibold text-white">SnapInvest</h1>

      {/* Search bar */}
      <div className="relative w-1/3">
        <Search
          className={`absolute left-2 top-2.5 h-4 w-4 ${
            isLight ? "text-gray-400" : "text-gray-400"
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search stocks..."
          className={`w-full pl-8 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none ${
            isLight ? "bg-white text-gray-800 border border-gray-200" : "bg-[#1a1d22] text-gray-200"
          }`}
        />
        {searchQuery.trim() && (
          <div
            className={`absolute left-0 right-0 top-11 rounded-lg border shadow-xl ${
              isLight ? "bg-white border-gray-200" : "bg-[#1c1f25] border-neutral-800"
            }`}
          >
            {searchLoading ? (
              <div className="px-3 py-2 text-sm text-gray-400">Searching…</div>
            ) : suggestions.length > 0 ? (
              <ul>
                {suggestions.slice(0, 5).map((item) => (
                  <li
                    key={item.symbol}
                    className={`cursor-pointer px-3 py-2 text-sm ${
                      isLight
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-gray-200 hover:bg-neutral-800"
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectSuggestion(item)}
                  >
                    <div className="font-medium">{item.symbol}</div>
                    <div className="text-xs text-gray-400">
                      {item.name || item.region || item.type || "Symbol"}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400">No matches</div>
            )}
          </div>
        )}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4 relative">
        {/* Deposit */}
        <button
          onClick={onDeposit}
          className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-700 px-3 py-1.5 rounded-lg text-sm transition"
        >
          <Download size={14} />
          Deposit
        </button>

        {/* Withdraw */}
        <button
          onClick={onWithdraw}
          className="flex items-center gap-1 border border-cyan-500 hover:bg-cyan-900 px-3 py-1.5 rounded-lg text-sm transition"
        >
          <Upload size={14} />
          Withdraw
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 hover:bg-neutral-800 rounded-full"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-64 rounded-lg border shadow-lg text-sm ${
                isLight ? "bg-white border-gray-200" : "bg-[#1c1f25] border-neutral-700"
              }`}
            >
              <div
                className={`p-2 font-medium border-b ${
                  isLight ? "text-gray-700 border-gray-200" : "text-gray-300 border-neutral-700"
                }`}
              >
                Notifications
              </div>
              <ul className="max-h-48 overflow-y-auto">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`px-3 py-2 border-b last:border-none ${
                      isLight
                        ? "text-gray-700 border-gray-200 hover:bg-gray-100"
                        : "text-gray-200 border-neutral-700 hover:bg-neutral-800"
                    }`}
                  >
                    {n.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex flex-col text-right mr-2">
                <span className="text-sm text-gray-200">{user?.displayName || user?.email}</span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowProfile((prev) => !prev)}
                  className="p-2 hover:bg-neutral-800 rounded-full"
                >
                  <User size={18} />
                </button>

                {showProfile && (
                  <div
                    className={`absolute right-0 mt-2 w-40 rounded-lg border shadow-lg text-sm ${
                      isLight ? "bg-white border-gray-200" : "bg-[#1c1f25] border-neutral-700"
                    }`}
                  >
                    <ul
                      className={`divide-y ${
                        isLight ? "divide-gray-200" : "divide-neutral-700"
                      }`}
                    >
                      <li
                        onClick={() => {
                          setShowProfile(false);
                          navigate('/profile');
                        }}
                        className={`px-3 py-2 cursor-pointer ${
                          isLight ? "hover:bg-gray-100 text-gray-700" : "hover:bg-neutral-800"
                        }`}
                      >
                        Profile
                      </li>
                      <li
                        className={`px-3 py-2 cursor-pointer ${
                          isLight ? "hover:bg-gray-100 text-gray-700" : "hover:bg-neutral-800"
                        }`}
                      >
                        Settings
                      </li>
                      <li
                        onClick={async () => {
                          await logout();
                          navigate("/login");
                        }}
                        className={`px-3 py-2 cursor-pointer text-red-400 ${
                          isLight ? "hover:bg-gray-100" : "hover:bg-neutral-800"
                        }`}
                      >
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <button
                onClick={() => navigate("/login")}
                className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1.5 rounded-lg text-sm"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
