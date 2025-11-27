import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function Settings() {
  const { theme, setTheme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-100">Settings</h2>
        <p className="text-sm text-gray-400">Customize your dashboard preferences.</p>
      </div>

      {/* Preferences */}
      <div className="card p-4">
        <div className="card-header mb-2">
          <h3 className="text-sm font-medium text-gray-200">Preferences</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Currency</label>
            <select className="input">
              <option>USD ($)</option>
              <option>INR (₹)</option>
              <option>EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Default Page</label>
            <select className="input">
              <option>Dashboard</option>
              <option>Portfolio</option>
              <option>Settings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-4">
        <div className="card-header mb-2">
          <h3 className="text-sm font-medium text-gray-200">Notifications</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Price alerts</span>
            <input type="checkbox" className="h-4 w-4" defaultChecked />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Daily summary</span>
            <input type="checkbox" className="h-4 w-4" />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-300">News updates</span>
            <input type="checkbox" className="h-4 w-4" defaultChecked />
          </label>
        </div>
      </div>

      {/* Theme (stub) */}
      <div className="card p-4">
        <div className="card-header mb-2">
          <h3 className="text-sm font-medium text-gray-200">Appearance</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-200">Theme</p>
            <p className="text-xs text-gray-400">
              {isLight ? "Light mode is active." : "Dark mode is active."}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                !isLight
                  ? "bg-gray-900 text-white border-gray-700"
                  : "bg-white text-gray-600 border-gray-300"
              } ${!isLight ? "ring-2 ring-indigo-500" : ""}`}
              disabled={!isLight ? true : false}
            >
              Dark
            </button>
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                isLight
                  ? "bg-white text-gray-800 border-gray-300"
                  : "bg-gray-800 text-gray-200 border-gray-700"
              } ${isLight ? "ring-2 ring-indigo-500" : ""}`}
              disabled={isLight ? true : false}
            >
              Light
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-outline"
            >
              Toggle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
