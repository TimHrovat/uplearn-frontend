import { useQuery } from "@tanstack/react-query";
import React from "react";
import { EventsApi } from "../../../api/events/events-api";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";
import PageOutline from "../../../components/pages/PageOutline";

export default function UpcomingEvents() {
  const { status, data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  const { data: upcoming } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: () => EventsApi.getUpcoming(authUser?.data.Student?.class?.name),
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
      <PageOutline title="Upcoming Events">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <td></td>
                <th>Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {upcoming?.data.length === 0 ? (
                <tr className="text-center">
                  <td colSpan={5}>There are no upcoming events</td>
                </tr>
              ) : (
                upcoming?.data.map((event: EventInterface, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{event.type}</td>
                    <td>{toDateString(event.date)}</td>
                    <td>
                      {event.type === "ACT"
                        ? `${event.startTime}-${event.endTime}`
                        : "/"}
                    </td>
                    <td className="whitespace-normal break-words">
                      {event.description}
                    </td>
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
  startTime: string;
  endTime: string;
  description: string;
}
