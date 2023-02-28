import { useQuery } from "@tanstack/react-query";
import React from "react";
import { AuthApi } from "../../api/auth/auth-api";
import { UsersApi } from "../../api/users/users-api";
import PageOutline from "../pages/PageOutline";
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
    else
      timetable = <Timetable classNameP={authUser?.data.Student.class.name} />;
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
      <PageOutline title="Timetable" fullWidth>
        {timetable}
      </PageOutline>
    </>
  );
}
