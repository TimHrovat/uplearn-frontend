import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  AbsenceInterface,
  AbsencesApi,
} from "../../../api/absences/absences-api";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";

export default function Absences() {
  const [error, setError] = useState("");

  const { status, data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  const { data: absences } = useQuery({
    queryKey: ["absences"],
    queryFn: () => AbsencesApi.getByStudent(authUser?.data.Student?.id),
    enabled: authUser?.data.Student?.id !== undefined,
  });

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
          <h1 className="text-xl font-bold mb-5">Absences</h1>
          <span className="mr-5">{`Excused: ${absences?.data.excused ?? "--"}`}</span>
          <span>{`Unexcused: ${absences?.data.unexcused ?? "--"}`}</span>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <td></td>
                  <th>State</th>
                  <th>Subject</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {absences?.data.lessons?.length === 0 ? (
                  <tr className="text-center">
                    <td colSpan={4}>There are no absences</td>
                  </tr>
                ) : (
                  absences?.data.lessons?.map(
                    (absence: AbsenceInterface, index: number) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{absence.state}</td>
                        <td>{absence.lesson.subjectAbbreviation}</td>
                        <td>{toDateString(absence.lesson.date)}</td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
