import React from "react";
import { Bell, Search } from "lucide-react";

export default function TopNav() {
  return (
    <header className="sticky top-0 z-30 w-full bg-neutral-900/80 backdrop-blur border-b border-neutral-800">
      <div className="container flex h-14 items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-brand-600 flex items-center justify-center text-white font-semibold">
            S
          </div>
          <span className="text-base font-semibold text-gray-100">Stock Dashboard</span>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search stocks, symbols..."
            className="input pl-9"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="btn-ghost h-9 w-9 p-0 rounded-full">
            <Bell className="h-5 w-5" />
          </button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center text-sm font-semibold shadow-card">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
