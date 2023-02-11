import { useQuery } from "@tanstack/react-query";
import React from "react";
import { AuthApi } from "../../api/auth/auth-api";
import { UsersApi } from "../../api/users/users-api";
import Timetable from "./Timetable";

export default function TimetablePage() {
  const { data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  let timetable = <Timetable />;

  if (AuthApi.isStudent()) {
    if (!authUser?.data.Student || !authUser?.data.Student.class)
      timetable = <NoTimetable />;
    else timetable = <Timetable classNameP={authUser?.data.Student.class.name} />;
  }

  function NoTimetable() {
    return (
      <>
        <div className="h-2/3 flex flex-row justify-center content-center text-error">
          <span>
            You are not assigned to a class, please contact school management
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-base-200 p-4 rounded-xl w-full max-w-screen-xl mb-5">
        <h1 className="text-xl font-bold mb-5">Timetable</h1>
        {timetable}
      </div>
    </>
  );
}
