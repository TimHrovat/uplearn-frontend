import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  EmployeeGradeInterface,
  EmployeeGradesApi,
} from "../../../api/employee-grades/employee-grades-api";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";
import PageOutline from "../../../components/pages/PageOutline";

export default function MyPerformance() {
  const { data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  const { status: gradesStatus, data: grades } = useQuery({
    queryKey: ["myGrades"],
    queryFn: () => EmployeeGradesApi.getByEmployee(authUser?.data.Employee?.id),
    enabled: authUser?.data.Employee?.id !== undefined,
  });

  if (gradesStatus === "loading") return <Loader active={true} />;
  if (gradesStatus === "error")
    return <ErrorAlert msg={"Page couldn't load"} />;

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
      <PageOutline title="My Performance">
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
      </PageOutline>
    </>
  );
}
