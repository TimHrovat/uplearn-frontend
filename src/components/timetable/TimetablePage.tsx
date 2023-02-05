import React from "react";
import Timetable from "./Timetable";

export default function TimetablePage() {
  return (
    <>
      <div className="bg-base-200 p-4 rounded-xl w-full max-w-screen-xl mb-5">
        <h1 className="text-xl font-bold mb-5">Timetable</h1>
        <Timetable />
      </div>
    </>
  );
}
