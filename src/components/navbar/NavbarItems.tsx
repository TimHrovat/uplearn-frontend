import React from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthApi } from "../../api/auth/auth-api";

export default function NavbarItems() {
  if (AuthApi.isAdmin()) {
    return (
      <>
        <Link to={"/dashboard/1"}>Admin 1</Link>
        <Link to={"/dashboard/2"}>Admin 2</Link>
      </>
    );
  } else if (AuthApi.isStudent()) {
    return (
      <>
        <Link to={"/dashboard/1"}>Student 1</Link>
        <Link to={"/dashboard/2"}>Student 2</Link>
      </>
    );
  } else if (AuthApi.isEmployee()) {
    return (
      <>
        <Link to={"/dashboard/1"}>Employee 1</Link>
        <Link to={"/dashboard/2"}>Employee 2</Link>
      </>
    );
  }

  return <Navigate to={"/login"}/>;
}
