import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  EmployeeGradeInterface,
  EmployeeGradesApi,
} from "../../../api/employee-grades/employee-grades-api";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";

export default function MyPerformance() {
  const [error, setError] = useState("");

  const { data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  const {
    status: gradesStatus,
    data: grades,
    refetch: refetchGrades,
  } = useQuery({
    queryKey: ["myGrades"],
    queryFn: () => EmployeeGradesApi.getByEmployee(authUser?.data.Employee?.id),
    enabled: authUser?.data.Employee?.id !== undefined,
  });

  if (gradesStatus === "loading") return <Loader active={true} />;
  if (gradesStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  interface StarsProps {
    value: number;
  }

  function Stars({ value }: StarsProps) {
    return (
      <div className="flex flex-row">
        {[...Array(5)].map((e, index: number) => (
          <div
            key={index}
            className={Number(value) > index ? "text-info " : "text-content"}
          >
            <FontAwesomeIcon icon={faStar} size="lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">My Performance</h1>
          <span className="flex flex-row gap-4">
            <Stars value={Math.round(Number(grades?.data.avg))} />{" "}
            {(grades?.data.avg?.toFixed(2) ?? "?") + " out of 5"}
          </span>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <td></td>
                  <th>Grade</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {grades?.data.grades?.map(
                  (grade: EmployeeGradeInterface, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <Stars value={grade.value} />
                      </td>
                      <td className="whitespace-normal break-words">
                        {grade.comment ?? "/"}
                      </td>
                    </tr>
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
