import React from "react";
import { Home, BarChart, Briefcase, Star, Settings } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Sidebar() {
  const navItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/" },
    { name: "Portfolio", icon: <Briefcase size={20} />, path: "/portfolio" },
    { name: "Watchlist", icon: <Star size={20} />, path: "/watchlist" },
    { name: "Analytics", icon: <BarChart size={20} />, path: "/analytics" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const navigate = useNavigate();

  // If not authenticated, hide protected routes and show a Login link instead
  const publicNav = [{ name: "Sign in", icon: <Home size={20} />, path: "/login" }];
  const itemsToShow = user ? navItems : publicNav;

  return (
    <div
      className={`h-screen w-64 flex flex-col shadow-lg transition-colors duration-200 ${
        isLight ? "bg-white text-gray-900" : "bg-gray-900 text-gray-200"
      }`}
    >
      {/* Brand Name */}
      <div className="p-5 text-2xl font-bold text-indigo-500">SnapInvest</div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-2">
        {itemsToShow.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? isLight
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-indigo-600 text-white"
                  : isLight
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={`p-4 border-t text-sm ${
          isLight ? "border-gray-200 text-gray-500" : "border-gray-700 text-gray-400"
        }`}
      >
        © 2025 SnapInvest
      </div>
    </div>
  );
}
