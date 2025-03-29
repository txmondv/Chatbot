import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";
import { profileDropdownLinks } from "../config/LinkConfig";
import { getStorageValue } from "../storage/StorageProvider";
import { AuthProvider, useAuth } from "./custom/Authentication/AuthProvider";
import { Navbar } from "./custom/Navbar/Navbar";
import Sidebar from "./custom/Sidebar/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { authenticated: isAuthenticated, loading } = useAuth();

  if (loading) return;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [sidebarLocked, setSidebarLocked] = useState<boolean>(getStorageValue("sidebarLocked") as boolean);

  return (
    <Router> {/* Move Router here to wrap everything */}
      <AuthProvider>
      <div className="flex min-h-screen max-w-screen bg-zinc-900 text-white">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <Sidebar handleSidebarLock={setSidebarLocked} />
                  <div className={`flex flex-col w-full transition-all duration-300 ${sidebarLocked ? "ml-72" : "ml-16"}`}>
                    <Navbar sidebarExpanded={sidebarLocked} links={profileDropdownLinks} className={`mb-2 transition-all duration-300 ${sidebarLocked ? "ml-72" : "ml-16"}`} />
                    <div className="flex-1 overflow-auto mt-12">
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </div>
                  </div>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      </AuthProvider>
    </Router>
  );
}
