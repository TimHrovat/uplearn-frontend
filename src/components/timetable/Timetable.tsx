import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { SchoolHoursApi } from "../../api/school-hours/school-hours-api";
import {
  SchoolHourInterface,
  toFormattedDate,
} from "../../pages/dashboard/admin/ManageSchoolHours";
import ErrorAlert from "../alerts/ErrorAlert";
import Loader from "../Loader";
import TimetableClassSelection from "./TimetableClassSelection";
import TimetableLesson from "./TimetableLesson";
import TimetableWeekPicker from "./TimetableWeekPicker";

export type TimetableProps = {
  classNameP?: string;
};

export default function Timetable({ classNameP }: TimetableProps) {
  const [error, setError] = useState("");
  const [className, setClassName] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const {
    status: schoolHoursStatus,
    data: schoolHours,
    refetch,
  } = useQuery({
    queryKey: ["classrooms"],
    queryFn: SchoolHoursApi.getAll,
  });

  if (schoolHoursStatus === "loading") return <Loader active={true} />;
  if (schoolHoursStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  const setNewWeek = (stDate: Date, enDate: Date) => {
    setStartDate(stDate);
    setEndDate(enDate);
  }

  return (
    <>
      <TimetableClassSelection
        active={
          classNameP === "" || classNameP === undefined || className === null
        }
        onSelection={(cName) => setClassName(cName)}
      />
      <TimetableWeekPicker onSelection={(startDate, endDate) => setNewWeek(startDate, endDate)}/>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full table-auto">
          <thead>
            <tr>
              <td></td>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
            </tr>
          </thead>
          <tbody>
            {schoolHours?.data.map(
              (schoolHour: SchoolHourInterface, index: number) => (
                <tr key={index}>
                  <td>
                    <div className="flex flex-col">
                      <span className="mb-2">{index + 1 + ". lesson"}</span>
                      <span>
                        {toFormattedDate(schoolHour.startTime) +
                          "-" +
                          toFormattedDate(schoolHour.endTime)}
                      </span>
                    </div>
                  </td>
                  <td className="p-0 pr-2">
                    <TimetableLesson />
                  </td>
                  <td className="p-0 pr-2">
                    <TimetableLesson />
                  </td>
                  <td className="p-0 pr-2">
                    <TimetableLesson />
                  </td>
                  <td className="p-0 pr-2">
                    <TimetableLesson />
                  </td>
                  <td className="p-0">
                    <TimetableLesson />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
