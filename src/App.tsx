import "./index.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute, { ProtectedRouteProps } from "./components/ProtectedRoute";
import { AuthApi } from "./api/auth/auth-api";
import ProtectedRouteStrict, { ProtectedRouteStrictProps } from "./components/ProtectedRouteStrict";
import ReplaceFirstPasswordPage from "./pages/ReplaceFirstPasswordPage";

const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
  isAuthenticated: AuthApi.isAuthenticated(),
  authenticationPath: "/",
};

const defaultProtectedRouteStrictProps: Omit<ProtectedRouteStrictProps, "outlet"> = {
  isAuthenticated: AuthApi.isAuthenticatedStrict(),
  authenticationPath: "/",
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/auth/replace-first-password" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<ReplaceFirstPasswordPage />} />} />
        <Route path="/dashboard" element={<ProtectedRouteStrict {...defaultProtectedRouteStrictProps} outlet={<DashboardPage />} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
