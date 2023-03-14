import { useQuery } from "@tanstack/react-query";
import React from "react";
import { AuthApi } from "../../api/auth/auth-api";
import { UsersApi } from "../../api/users/users-api";
import ErrorAlert from "../alerts/ErrorAlert";
import Loader from "../Loader";
import PageOutline from "../pages/PageOutline";
import Timetable from "./Timetable";

export default function TimetablePage() {
  const { status, data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  if (status === "loading") return <Loader active={true} />;
  if (status === "error") return <ErrorAlert msg={"Page couldn't load"} />;

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
