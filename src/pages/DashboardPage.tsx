import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../api/auth/auth-api";

export default function DashboardPage() {
  const navigate = useNavigate();

  const logout = async (e: React.SyntheticEvent) => {
    await AuthApi.logout();

    navigate("/");
  };

  return <button onClick={logout}>Logout</button>;
}
