import React from "react";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { useTheme } from "../contexts/ThemeContext";

export default function MainLayout({ children }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`flex min-h-screen transition-colors duration-200 ${
        isLight ? "bg-gray-50 text-gray-900" : "bg-gray-900 text-gray-100"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`w-64 fixed h-screen ${
          isLight ? "bg-white border-r border-gray-200" : "bg-gray-800"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 ml-64">
        <TopNavbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
