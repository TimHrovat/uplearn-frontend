import React from "react";
import EmployeeTimetable from "./EmployeeTimetable";

export default function EmployeeTimetablePage() {
  return (
    <div className="bg-base-200 p-4 rounded-xl w-full max-w-screen-xl mb-5">
      <h1 className="text-xl font-bold mb-5">My Timetable</h1>
      <EmployeeTimetable />
    </div>
  );
}
