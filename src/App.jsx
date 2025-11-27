import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import PortfolioPage from "./pages/PortfolioPage";
import Watchlist from "./pages/Watchlist";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import RequireAuth from "./components/RequireAuth";
import Analytics from "./pages/Analytics";

function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // More robust redirect logic:
    // - Only redirect when Firebase/auth finished loading and user is unauthenticated
    // - Only redirect when current path is one of the app's protected routes
    // - Avoid redirecting for public/static routes or files
    // - Use a ref-like guard via location.state to avoid repeated redirects
    const protectedPaths = new Set([
      "/",
      "/portfolio",
      "/watchlist",
      "/transactions",
      "/profile",
      "/settings",
    ]);

    const isFileRequest = /\.[a-zA-Z0-9]+$/.test(location.pathname);
    const isProtected = protectedPaths.has(location.pathname);

    if (!loading && !user && isProtected && !isFileRequest) {
      // If the current location state already indicates we've redirected here, skip
      if (location.state && (location.state.fromLoginRedirect === true)) return;

      navigate("/login", { replace: true, state: { fromLoginRedirect: true, from: location } });
    }
  }, [user, loading, location.pathname, navigate]);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RequireAuth />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
