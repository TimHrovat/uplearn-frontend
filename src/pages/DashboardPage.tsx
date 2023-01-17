import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthApi } from "../api/auth/auth-api";
import { UsersApi } from "../api/users/users-api";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const user = UsersApi.getAuthenticatedUser().then((user) => {
    return user;
  });

  console.log(user);

  return <Navbar />;
}
