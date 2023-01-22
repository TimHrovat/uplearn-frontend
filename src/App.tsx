import "./index.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/dashboard/1";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/protected_routes/ProtectedRoute";
import ProtectedRouteAuthenticated from "./components/protected_routes/ProtectedRouteAuthenticated";
import ReplaceFirstPasswordPage from "./pages/ReplaceFirstPasswordPage";
import HeroPage from "./pages/HeroPage";
import DashboardRoute from "./components/DashboardRoute";
import DashboardPage2 from "./pages/dashboard/2";
import Settings from "./pages/dashboard/Settings";
import ProtectedRouteRole from "./components/protected_routes/ProtectedRouteRole";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HeroPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/replace-first-password" element={<ProtectedRoute outlet={<ReplaceFirstPasswordPage />} />} />

          <Route path="/dashboard/1" element={<ProtectedRouteAuthenticated outlet={<DashboardRoute element={<DashboardPage />} />} />} />
          <Route path="/dashboard/2" element={<ProtectedRouteRole outlet={<DashboardRoute element={<DashboardPage2 />} />} authorizedRoles={["admin"]} />} />
          <Route path="/dashboard/settings" element={<ProtectedRouteAuthenticated outlet={<DashboardRoute element={<Settings />} />} />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
