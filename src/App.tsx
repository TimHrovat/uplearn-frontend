import "./index.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute, {
  ProtectedRouteProps,
} from "./components/ProtectedRoute";
import { AuthApi } from "./api/auth/auth-api";

const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
  isAuthenticated: AuthApi.isAuthenticated(),
  authenticationPath: "/",
};

// AuthApi.logout();
// AuthApi.login({ username: "tim.hrovat1", password: "abcd1234" });

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              outlet={<DashboardPage />}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
