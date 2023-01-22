import "./index.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/protected_routes/ProtectedRoute";
import ProtectedRouteAuthenticated from "./components/protected_routes/ProtectedRouteAuthenticated";
import ReplaceFirstPasswordPage from "./pages/ReplaceFirstPasswordPage";
import HeroPage from "./pages/HeroPage";
import DashboardRoute from "./components/DashboardRoute";
import Settings from "./pages/dashboard/Settings";
import ProtectedRouteRole from "./components/protected_routes/ProtectedRouteRole";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HeroPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/replace-first-password" element={<ProtectedRoute outlet={<ReplaceFirstPasswordPage />} />} />

          <Route path="/dashboard" element={<ProtectedRouteAuthenticated outlet={<DashboardRoute element={<Dashboard />} />} />} />

          <Route path="/dashboard/settings" element={<ProtectedRouteAuthenticated outlet={<DashboardRoute element={<Settings />} />} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
