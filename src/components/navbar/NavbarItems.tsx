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
        <Link to={"/dashboard/manage-users"}>Users</Link>
        <Link to={"/dashboard/manage-grades"}>Gradebook</Link>
        <Link to={"/dashboard/manage-classrooms"}>Classrooms</Link>
        <Link to={"/dashboard/manage-school-hours"}>School Hours</Link>
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
        <Link to={"/dashboard/my-timetable"}>My Timetable</Link>
        <Link to={"/dashboard"}>All Timetables</Link>
        <Link to={"/dashboard/manage-grades"}>Gradebook</Link>
      </>
    );
  }

  return <Navigate to={"/login"}/>;
}
