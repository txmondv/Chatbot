import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";
import { profileDropdownLinks } from "../config/LinkConfig";
import { getStorageValue } from "../storage/StorageProvider";
import { AuthProvider, useAuth } from "./custom/Authentication/AuthProvider";
import { Navbar } from "./custom/Navbar/Navbar";
import Sidebar from "./custom/Sidebar/Sidebar";
import DashboardPage from "./pages/admin/DashboardPage";
import ModelsOverviewPage from "./pages/admin/ModelsOverviewPage";
import OllamaModelPage from "./pages/admin/OllamaModelPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import ChatPage from "./pages/chats/ChatPage";
import ChatsOverviewPage from "./pages/chats/ChatsOverviewPage";
import HomePage from "./pages/home/HomePage";
import NotFoundPage from "./pages/lib/NotFoundPage";
import { SupportTicketsPage } from "./pages/tickets/SupportTicketsPage";
import { UserTicketsPage } from "./pages/tickets/UserTicketsPage";
import UserTicketViewPage from "./pages/tickets/UserTicketViewPage";
import LoginPage from "./pages/user/LoginPage";
import LogoutPage from "./pages/user/LogoutPage";
import ProfilePage from "./pages/user/ProfilePage";
import RegisterPage from "./pages/user/RegisterPage";
import SupportTicketViewPage from "./pages/tickets/SupportTicketViewPage";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { authenticated: isAuthenticated, loading } = useAuth();

  if (loading) return;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [sidebarLocked, setSidebarLocked] = useState<boolean>(getStorageValue("sidebarLocked") as boolean);

  return (
    <Router>
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
                      <div className="flex-1 overflow-auto mt-16">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/users" element={<UserManagementPage />} />
                          <Route path="/dashboard" element={<DashboardPage />} />
                          <Route path="/models" element={<ModelsOverviewPage />} />
                          <Route path="/model/:modelName" element={<OllamaModelPage />} />
                          <Route path="/chats" element={<ChatsOverviewPage />} />
                          <Route path="/chats/:chatId" element={<ChatPage />} />
                          <Route path="/tickets" element={<UserTicketsPage />} />
                          <Route path="/tickets/:ticketId" element={<UserTicketViewPage />} />
                          <Route path="/requests" element={<SupportTicketsPage />} />
                          <Route path="/requests/:ticketId" element={<SupportTicketViewPage />} />
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
