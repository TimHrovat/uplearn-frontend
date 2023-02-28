import React from "react";
import PageOutline from "../pages/PageOutline";
import EmployeeTimetable from "./EmployeeTimetable";

export default function EmployeeTimetablePage() {
  return (
    <PageOutline title="My Timetable" fullWidth>
      <EmployeeTimetable />
    </PageOutline>
  );
}
