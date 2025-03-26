import { BrowserRouter as Router, Routes, Route } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import Sidebar from "./custom/Sidebar/Sidebar";
import { useState } from "react";
import { getStorageValue } from "../storage/StorageProvider";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  const [sidebarLocked, setSidebarLocked] = useState<boolean>(getStorageValue("sidebarLocked") as boolean);

  return (
    <Router>
      <div className="flex min-h-screen max-w-screen bg-zinc-900 text-white">
        <Sidebar handleSidebarLock={setSidebarLocked} />
        <div className={`${sidebarLocked ? "ml-72" : "ml-16"} transition-all duration-300 w-full h-screen`}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
