import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { EmployeesApi } from "../../api/employees/employees-api";
import { EventInterface, EventsApi } from "../../api/events/events-api";
import { LessonsApi } from "../../api/lessons/lessons-api";
import { SchoolHoursApi } from "../../api/school-hours/school-hours-api";
import { UsersApi } from "../../api/users/users-api";
import {
  SchoolHourInterface,
  toFormattedDate,
} from "../../pages/dashboard/admin/ManageSchoolHours";
import ErrorAlert from "../alerts/ErrorAlert";
import Loader from "../Loader";
import LessonInfoModal from "../modals/lessons/LessonInfoModal";
import EmployeeTimetableLesson, {
  EmployeeTimetableLessonProps,
} from "./EmployeeTimetableLesson";
import TimetableEvent from "./TimetableEvent";
import TimetableWeekPicker from "./TimetableWeekPicker";

export default function EmployeeTimetable() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [lessonInfoModalActive, setLessonInfoModalActive] = useState(false);

  const { status: schoolHoursStatus, data: schoolHours } = useQuery({
    queryKey: ["schoolHours"],
    queryFn: SchoolHoursApi.getAll,
  });

  const { status: authUserStatus, data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  const {
    status: lessonsStatus,
    data: lessons,
    refetch: refetchLessons,
  } = useQuery(
    ["lessons", authUser?.data.Employee?.id, startDate, endDate],
    () =>
      LessonsApi.getLessonsByEmployeeAndDateRange(
        authUser?.data.Employee.id,
        moment(startDate).subtract(1, "d").toDate().toISOString() ?? "",
        moment(endDate).add(1, "d").toDate().toISOString() ?? ""
      ),
    {
      enabled:
        checkStatesInitialized(startDate, endDate) &&
        authUser?.data.Employee?.id !== null,
    }
  );

  const {
    status: eventsStatus,
    data: events,
    refetch: refetchEvents,
  } = useQuery(
    ["events", authUser?.data.Employee?.id, startDate, endDate],
    () =>
      EventsApi.getEventsByEmployeeAndDateRange(
        authUser?.data.Employee?.id,
        moment(startDate).subtract(1, "d").toDate().toISOString() ?? "",
        moment(endDate).add(1, "d").toDate().toISOString() ?? ""
      ),
    {
      enabled:
        checkStatesInitialized(startDate, endDate) &&
        authUser?.data.Employee?.id !== undefined,
    }
  );

  const {
    status: ongoingLessonStatus,
    data: ongoingLesson,
    refetch: refetchOngoingLesson,
  } = useQuery({
    queryKey: ["ongoingLesson"],
    queryFn: () => EmployeesApi.getOngoingLesson(authUser?.data.Employee?.id),
    enabled: authUser?.data.Employee?.id !== undefined,
  });

  if (
    schoolHoursStatus === "loading" ||
    authUserStatus === "loading" ||
    ongoingLessonStatus === "loading"
  )
    return <Loader active={true} />;
  if (
    schoolHoursStatus === "error" ||
    authUserStatus === "error" ||
    lessonsStatus === "error" ||
    eventsStatus === "error" ||
    ongoingLessonStatus === "error"
  )
    return <ErrorAlert msg={"Page couldn't load"} />;

  const setNewWeek = (stDate: Date, enDate: Date) => {
    setStartDate(stDate);
    setEndDate(enDate);
  };

  const getTimetableLessonProps = (schoolHourId: string, dayOfWeek: number) => {
    let props: Omit<
      EmployeeTimetableLessonProps,
      "schoolHourId" | "date" | "onClose"
    > = {
      subject: "",
      teacher: "",
      classroom: "",
      lessonId: "",
      type: "",
      employeeId: "",
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
      if (result.type === "SUBSTITUTE") {
        const teacher = result.substituteEmployee.user;

        props.teacher = teacher.name + " " + teacher.surname;
      } else {
        const teacher = result.employee_Subject.employee.user;

        props.teacher = teacher.name + " " + teacher.surname;
      }

      props.subject = result.subjectAbbreviation;
      props.classroom = result.classroomName;
      props.type = result.type;
      props.lessonId = result.id;
    }

    return props;
  };

  interface EventListInterface {
    dayOfWeek: number;
  }

  function EventList({ dayOfWeek }: EventListInterface) {
    let result = events?.data.filter(
      (event: EventInterface) =>
        event.date.split("T")[0] ===
        moment(startDate)
          .add(dayOfWeek, "d")
          .toDate()
          .toISOString()
          .split("T")[0]
    );

    if (!result) return <></>;

    return (
      <>
        <div className="flex flex-col">
          {result.map((event: EventInterface, index: number) => (
            <TimetableEvent key={index} event={event} onClose={refetchEvents} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <LessonInfoModal
        active={lessonInfoModalActive}
        lessonId={ongoingLesson?.data.id}
        onActiveChange={(active) => {
          setLessonInfoModalActive(active);
          refetchLessons();
          refetchOngoingLesson();
        }}
      />
      {ongoingLesson?.data === "" ? (
        <TimetableWeekPicker
          onSelection={(startDate, endDate) => setNewWeek(startDate, endDate)}
        />
      ) : (
        <div className="flex items-center">
          <div className="flex-1">
            <TimetableWeekPicker
              onSelection={(startDate, endDate) =>
                setNewWeek(startDate, endDate)
              }
            />
          </div>
          <div className="flex-1">
            <button
              className="btn btn-primary float-right"
              onClick={() => setLessonInfoModalActive(true)}
            >
              Current Lesson
            </button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <td>
                <div className="w-1/6"></div>
              </td>
              <th>
                <TimetableHeader
                  dayNum={0}
                  dayName={"Monday"}
                  startDate={startDate}
                />
              </th>
              <th>
                <TimetableHeader
                  dayNum={1}
                  dayName={"Tuesday"}
                  startDate={startDate}
                />
              </th>
              <th>
                <TimetableHeader
                  dayNum={2}
                  dayName={"Wednesday"}
                  startDate={startDate}
                />
              </th>
              <th>
                <TimetableHeader
                  dayNum={3}
                  dayName={"Thursday"}
                  startDate={startDate}
                />
              </th>
              <th>
                <TimetableHeader
                  dayNum={4}
                  dayName={"Friday"}
                  startDate={startDate}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="p-0">
              <td className="border-r-[1px] border-zinc-700">Events</td>
              <td className="p-0 border-r-[1px] border-zinc-700">
                <EventList dayOfWeek={0} />
              </td>
              <td className="p-0 border-r-[1px] border-zinc-700">
                <EventList dayOfWeek={1} />
              </td>
              <td className="p-0 border-r-[1px] border-zinc-700">
                <EventList dayOfWeek={2} />
              </td>
              <td className="p-0 border-r-[1px] border-zinc-700">
                <EventList dayOfWeek={3} />
              </td>
              <td className="p-0 border-r-[1px] border-zinc-700">
                <EventList dayOfWeek={4} />
              </td>
            </tr>
            {schoolHours?.data.map(
              (schoolHour: SchoolHourInterface, index: number) => (
                <tr key={index}>
                  <td className="border-r-[1px] border-zinc-700">
                    <div className="flex flex-col">
                      <span className="mb-2">{index + 1 + ". lesson"}</span>
                      <span>
                        {toFormattedDate(schoolHour.startTime) +
                          "-" +
                          toFormattedDate(schoolHour.endTime)}
                      </span>
                    </div>
                  </td>
                  <td className="p-0 border-r-[1px] border-zinc-700">
                    <EmployeeTimetableLesson
                      {...getTimetableLessonProps(schoolHour.id, 0)}
                      schoolHourId={schoolHour.id}
                      date={moment(startDate)
                        .add(0, "d")
                        .toDate()
                        .toISOString()}
                      onClose={() => {
                        refetchLessons();
                        refetchOngoingLesson();
                      }}
                      employeeId={authUser?.data.Employee?.id}
                    />
                  </td>
                  <td className="p-0 border-r-[1px] border-zinc-700">
                    <EmployeeTimetableLesson
                      {...getTimetableLessonProps(schoolHour.id, 1)}
                      schoolHourId={schoolHour.id}
                      date={moment(startDate)
                        .add(1, "d")
                        .toDate()
                        .toISOString()}
                      onClose={() => {
                        refetchLessons();
                        refetchOngoingLesson();
                      }}
                      employeeId={authUser?.data.Employee?.id}
                    />
                  </td>
                  <td className="p-0 border-r-[1px] border-zinc-700">
                    <EmployeeTimetableLesson
                      {...getTimetableLessonProps(schoolHour.id, 2)}
                      schoolHourId={schoolHour.id}
                      date={moment(startDate)
                        .add(2, "d")
                        .toDate()
                        .toISOString()}
                      onClose={() => {
                        refetchLessons();
                        refetchOngoingLesson();
                      }}
                      employeeId={authUser?.data.Employee?.id}
                    />
                  </td>
                  <td className="p-0 border-r-[1px] border-zinc-700">
                    <EmployeeTimetableLesson
                      {...getTimetableLessonProps(schoolHour.id, 3)}
                      schoolHourId={schoolHour.id}
                      date={moment(startDate)
                        .add(3, "d")
                        .toDate()
                        .toISOString()}
                      onClose={() => {
                        refetchLessons();
                        refetchOngoingLesson();
                      }}
                      employeeId={authUser?.data.Employee?.id}
                    />
                  </td>
                  <td className="p-0 border-r-[1px] border-zinc-700">
                    <EmployeeTimetableLesson
                      {...getTimetableLessonProps(schoolHour.id, 4)}
                      schoolHourId={schoolHour.id}
                      date={moment(startDate)
                        .add(4, "d")
                        .toDate()
                        .toISOString()}
                      onClose={() => {
                        refetchLessons();
                        refetchOngoingLesson();
                      }}
                      employeeId={authUser?.data.Employee?.id}
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

interface TimetableHeaderProps {
  dayNum: number;
  dayName: string;
  startDate: Date | undefined;
}

function TimetableHeader({ dayName, startDate, dayNum }: TimetableHeaderProps) {
  const [date, setDate] = useState(moment(startDate).add(dayNum, "d").toDate());

  useEffect(() => {
    setDate(moment(startDate).add(dayNum, "d").toDate());
  }, [dayNum, startDate]);

  if (startDate === undefined) return <span>{dayName}</span>;

  return (
    <>
      <div className="flex flex-col w-1/6">
        <span>{`${dayName} `}</span>
        <span>{`${date?.getDate()}. ${
          date?.getMonth() !== undefined ? date?.getMonth() + 1 : ""
        }`}</span>
      </div>
    </>
  );
}

const checkStatesInitialized = (
  startDate: Date | undefined,
  endDate: Date | undefined
) => {
  const state = startDate === undefined || endDate === undefined ? false : true;

  return state;
};
