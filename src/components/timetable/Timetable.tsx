import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useState } from "react";
import { LessonsApi } from "../../api/lessons/lessons-api";
import { SchoolHoursApi } from "../../api/school-hours/school-hours-api";
import {
  SchoolHourInterface,
  toFormattedDate,
} from "../../pages/dashboard/admin/ManageSchoolHours";
import ErrorAlert from "../alerts/ErrorAlert";
import Loader from "../Loader";
import AddLessonModal from "../modals/AddLessonModal";
import TimetableClassSelection from "./TimetableClassSelection";
import TimetableLesson, { TimetableLessonProps } from "./TimetableLesson";
import TimetableWeekPicker from "./TimetableWeekPicker";

export type TimetableProps = {
  classNameP?: string;
};

export default function Timetable({ classNameP }: TimetableProps) {
  const [error, setError] = useState("");

  const [className, setClassName] = useState<string>(classNameP ?? "");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const {
    status: schoolHoursStatus,
    data: schoolHours,
    refetch,
  } = useQuery({
    queryKey: ["schoolHours"],
    queryFn: SchoolHoursApi.getAll,
  });

  const {
    status: lessonsStatus,
    data: lessons,
    refetch: lessonsRefetch,
  } = useQuery(
    [className, startDate, endDate],
    () =>
      LessonsApi.getLessonsByClassAndDateRange(
        className ?? "",
        moment(startDate).subtract(1, "d").toDate().toISOString() ?? "",
        moment(endDate).add(1, "d").toDate().toISOString() ?? ""
      ),
    {
      enabled: checkStatesInitialized(
        classNameP ?? className,
        startDate,
        endDate
      ),
    }
  );

  if (schoolHoursStatus === "loading") return <Loader active={true} />;
  if (schoolHoursStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  if (lessonsStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  const setNewWeek = (stDate: Date, enDate: Date) => {
    setStartDate(stDate);
    setEndDate(enDate);
  };

  const getTimetableLessonProps = (schoolHourId: string, dayOfWeek: number) => {
    let props: Omit<TimetableLessonProps, "schoolHourId" | "date"> = {
      subject: "",
      teacher: "",
      classroom: "",
    };

    var result = lessons?.data.find(
      (item: { schoolHourId: string; date: string }) =>
        item.schoolHourId === schoolHourId &&
        item.date.split("T")[0] ===
          moment(startDate)
            .add(dayOfWeek, "d")
            .toDate()
            .toISOString()
            .split("T")[0]
    );

    if (result) {
      const teacher = result.employee_Subject.employee.user;

      props.subject = result.subjectAbbreviation;
      props.classroom = result.classroomName;
      props.teacher = teacher.name + " " + teacher.surname;
    }

    return props;
  };

  return (
    <>
      {classNameP === "" || classNameP === undefined || className === null ? (
        <TimetableClassSelection
          active={true}
          onSelection={(cName) => setClassName(cName)}
        />
      ) : (
        <></>
      )}
      <TimetableWeekPicker
        onSelection={(startDate, endDate) => setNewWeek(startDate, endDate)}
      />
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
                    <TimetableLesson
                      {...getTimetableLessonProps(schoolHour.id, 0)}
                      schoolHourId={schoolHour.id}
                      date={moment(startDate)
                        .add(0, "d")
                        .toDate()
                        .toISOString()}
                    />
                  </td>
                  <td className="p-0 pr-2">
                    <TimetableLesson
                      {...getTimetableLessonProps(schoolHour.id, 1)}
                      schoolHourId={schoolHour.id}
                      date={moment(startDate)
                        .add(1, "d")
                        .toDate()
                        .toISOString()}
                    />
                  </td>
                  <td className="p-0 pr-2">
                    <TimetableLesson
                      {...getTimetableLessonProps(schoolHour.id, 2)}
                      schoolHourId={schoolHour.id}
                      date={moment(startDate)
                        .add(2, "d")
                        .toDate()
                        .toISOString()}
                    />
                  </td>
                  <td className="p-0 pr-2">
                    <TimetableLesson
                      {...getTimetableLessonProps(schoolHour.id, 3)}
                      schoolHourId={schoolHour.id}
                      date={moment(startDate)
                        .add(3, "d")
                        .toDate()
                        .toISOString()}
                    />
                  </td>
                  <td className="p-0">
                    <TimetableLesson
                      {...getTimetableLessonProps(schoolHour.id, 4)}
                      schoolHourId={schoolHour.id}
                      date={moment(startDate)
                        .add(4, "d")
                        .toDate()
                        .toISOString()}
                    />
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

const checkStatesInitialized = (
  className: string,
  startDate: Date | undefined,
  endDate: Date | undefined
) => {
  const state =
    className === "" ||
    className === undefined ||
    startDate === undefined ||
    endDate === undefined
      ? false
      : true;

  return state;
};
