import "./index.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute, { ProtectedRouteProps } from "./components/ProtectedRoute";
import ProtectedRouteStrict, { ProtectedRouteStrictProps } from "./components/ProtectedRouteStrict";
import ReplaceFirstPasswordPage from "./pages/ReplaceFirstPasswordPage";
import HeroPage from "./pages/HeroPage";
import DashboardRoute from "./components/DashboardRoute";
import DashboardPage2 from "./pages/DashboardPage2";

const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
  authenticationPath: "/login",
};

const defaultProtectedRouteStrictProps: Omit<ProtectedRouteStrictProps, "outlet"> = {
  authenticationPath: "/login",
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route
          path="/dashboard"
          element={<ProtectedRouteStrict {...defaultProtectedRouteStrictProps} outlet={<DashboardRoute element={<DashboardPage />} />} />}
        />
        <Route
          path="/dashboard2"
          element={<ProtectedRouteStrict {...defaultProtectedRouteStrictProps} outlet={<DashboardRoute element={<DashboardPage2 />} />} />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/replace-first-password" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<ReplaceFirstPasswordPage />} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
