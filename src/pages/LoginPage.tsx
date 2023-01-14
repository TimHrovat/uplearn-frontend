import React from "react";
import { AuthApi } from "../api/auth/auth-api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  async function login() {
    await AuthApi.login({ username: "", password: "" });
  }

  return (
    <>
      <div className="center">
        <h1>upLearn</h1>
      </div>
    </>
  );
}
