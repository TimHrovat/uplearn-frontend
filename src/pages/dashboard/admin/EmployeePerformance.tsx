import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  EmployeeGradeInterface,
  EmployeeGradesApi,
} from "../../../api/employee-grades/employee-grades-api";
import { EmployeesApi } from "../../../api/employees/employees-api";

import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";
import { EmployeeInterface } from "../../../components/modals/SubjectEditModal";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { style } from "../../../components/ReactSelectStyle";
import PageOutline from "../../../components/pages/PageOutline";

let employeeOptions: { value: string; label: string }[] = [];
const animatedComponents = makeAnimated();

export default function EmployeePerformance() {
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const { status, data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: EmployeesApi.getAll,
  });

  const { data: grades } = useQuery(
    ["gradesPerformance", selectedEmployee],
    () => EmployeeGradesApi.getByEmployee(selectedEmployee),
    { enabled: selectedEmployee !== "" && employees?.data !== undefined }
  );

  if (status === "loading") return <Loader active={true} />;
  if (status === "error") return <ErrorAlert msg={"Page couldn't load"} />;

  employeeOptions = [];
  employees?.data.forEach((employee: EmployeeInterface) => {
    employeeOptions.push({
      value: employee.id,
      label: `${employee.user.name} ${employee.user.surname}`,
    });
  });

  const handleSelectedEmployee = async (selected: any) => {
    setSelectedEmployee(selected.value);
  };

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

  if (grades?.data === undefined || grades?.data.grades?.length === 0)
    return (
      <>
        <PageOutline title="Employee Performance">
          <div className="form-control mb-5 mr-5 max-w-[15rem]">
            <label className="label">
              <span className="label-text">Class:</span>
            </label>
            <Select
              options={employeeOptions}
              closeMenuOnSelect={true}
              components={animatedComponents}
              onChange={handleSelectedEmployee}
              styles={style}
            />
          </div>
          {grades?.data.grades?.length === 0 ? (
            <span className="text-error">
              This employee has no logged grades
            </span>
          ) : (
            <></>
          )}
        </PageOutline>
      </>
    );

  return (
    <>
      <PageOutline title="Employee Performance">
        <div className="form-control mb-5 mr-5 max-w-[15rem]">
          <label className="label">
            <span className="label-text">Class:</span>
          </label>
          <Select
            options={employeeOptions}
            closeMenuOnSelect={true}
            components={animatedComponents}
            onChange={handleSelectedEmployee}
            styles={style}
          />
        </div>

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
