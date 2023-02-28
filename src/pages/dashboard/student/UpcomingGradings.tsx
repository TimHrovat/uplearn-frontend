import { useQuery } from "@tanstack/react-query";
import React from "react";
import { LessonsApi } from "../../../api/lessons/lessons-api";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";
import PageOutline from "../../../components/pages/PageOutline";

export default function UpcomingGradings() {
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

  if (status === "loading") return <Loader active={true} />;
  if (status === "error") return <ErrorAlert msg={"Page couldn't load"} />;

  const toDateString = (isodate: string) => {
    const date = new Date(isodate);

    const dateStr: string = `${date.getDate()}. ${
      date.getMonth() + 1
    }. ${date.getFullYear()}`;

    return dateStr;
  };

  return (
    <>
      <PageOutline title="Upcoming Gradings">
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
                  <td colSpan={4}>There are no upcoming gradings</td>
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
      </PageOutline>
    </>
  );
}

interface EventInterface {
  type: string;
  date: string;
  subjectAbbreviation: string;
}
