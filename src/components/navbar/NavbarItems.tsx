import React from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthApi } from "../../api/auth/auth-api";

export default function NavbarItems() {
  if (AuthApi.isAdmin()) {
    return (
      <>
        <Link to={"/dashboard"}>Timetable ADMIN</Link>
        <Link to={"/dashboard/manage-classes"}>Classes</Link>
        <Link to={"/dashboard/manage-subjects"}>Subjects</Link>
        <Link to={"/dashboard/manage-employees"}>Employees</Link>
        <Link to={"/dashboard/manage-students"}>Students</Link>
        <Link to={"/dashboard/manage-users"}>Users</Link>
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
