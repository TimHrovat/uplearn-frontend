import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { LessonsApi } from "../../../api/lessons/lessons-api";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";

export default function UpcomingEvents() {
  const [error, setError] = useState("");

  const { status, data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  const { data: upcoming } = useQuery({
    queryKey: ["upcomingGradings"],
    queryFn: () =>
      LessonsApi.getUpcomingGradings(authUser?.data.Student?.class?.name),
    enabled: authUser?.data.Student?.class?.name !== undefined,
  });

  console.log(upcoming?.data);

  if (status === "loading") return <Loader active={true} />;
  if (status === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  const toDateString = (isodate: string) => {
    const date = new Date(isodate);

    const dateStr: string = `${date.getDate()}. ${
      date.getMonth() + 1
    }. ${date.getFullYear()}`;

    return dateStr;
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">Upcoming Events</h1>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <td></td>
                  <th>Subject</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {upcoming?.data.length === 0 ? (
                  <tr className="text-center">
                    <td colSpan={4}>There are no upcoming events</td>
                  </tr>
                ) : (
                  upcoming?.data.map((event: EventInterface, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{event.subjectAbbreviation}</td>
                      <td>{event.type}</td>
                      <td>{toDateString(event.date)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

interface EventInterface {
  type: string;
  date: string;
  subjectAbbreviation: string;
}
