import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css"; // Make sure this exists and is imported
import { getUSDtoINR } from "./services/currency";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Warm up FX rate in background so the UI can show INR immediately when possible
// (call outside of JSX so we don't attempt to render a Promise)
getUSDtoINR().catch(() => {});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider
          router={createBrowserRouter(
            [
              {
                path: "/*",
                element: <App />,
              },
            ],
            {
              future: {
                // Opt-in to React Router v7 behaviors to silence warnings
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              },
            }
          )}
        />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
