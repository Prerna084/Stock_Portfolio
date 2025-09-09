import React from "react";
import Dashboard from "./pages/Dashboard"; // correct path

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      {/* Navbar */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-400">📊 Stock Dashboard</h1>
        <nav className="space-x-6">
          <a href="/" className="hover:text-green-400">Dashboard</a>
          <a href="/portfolio" className="hover:text-green-400">Portfolio</a>
          <a href="/settings" className="hover:text-green-400">Settings</a>
        </nav>
      </header>

      {/* Render Dashboard */}
      <Dashboard />
    </div>
  );
}

