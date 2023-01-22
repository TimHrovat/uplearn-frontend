import React from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthApi } from "../../api/auth/auth-api";

export default function NavbarItems() {
  if (AuthApi.isAdmin()) {
    return (
      <>
        <Link to={"/dashboard"}>Timetable ADMIN</Link>
      </>
    );
  } else if (AuthApi.isStudent()) {
    return (
      <>
        <Link to={"/dashboard"}>Timetable STUDENT</Link>
      </>
    );
  } else if (AuthApi.isEmployee()) {
    return (
      <>
        <Link to={"/dashboard"}>Timetable EMPLOYEE</Link>
      </>
    );
  }

  return <Navigate to={"/login"}/>;
}
