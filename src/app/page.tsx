"use client";

import React, { useState } from "react";
import SidebarLayout from "./SidebarLayout";
import Dashboard from "./Dashboard";
import ControlPage from "./control";
import StrategyPage from "./strategy";
import Market from "./Market";
import Reports from "./Report";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "strategies":
        return <StrategyPage />;
      case "control-capacity":
        return <ControlPage />;
      case "market-signals":
        return <Market />;
      case "reports":
        return <Reports />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-2xl font-bold text-gray-400">
              {currentPage.replace("-", " ").toUpperCase()} Component Coming Soon
            </h1>
          </div>
        );
    }
  };

  return (
    <SidebarLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderContent()}
    </SidebarLayout>
  );
}