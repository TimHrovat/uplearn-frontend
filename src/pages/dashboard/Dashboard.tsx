import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthApi } from "../../api/auth/auth-api";
import { UsersApi } from "../../api/users/users-api";
import Timetable from "../../components/timetable/Timetable";

export default function Dashboard() {
  return (
    <>
      <Timetable />
    </>
  );
}
