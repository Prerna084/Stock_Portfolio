import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import TopNav from "./components/layout/TopNav";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard"; // correct path
import PortfolioPage from "./pages/PortfolioPage";
import Settings from "./pages/Settings";

function AppLayout() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <TopNav />
      <div className="container flex gap-6 py-6">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

