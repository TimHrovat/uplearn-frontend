import { faPenToSquare, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  CreateEmployeeGradeInterface,
  EmployeeGradeInterface,
  EmployeeGradesApi,
  UpdateEmployeeGradeInterface,
} from "../../../api/employee-grades/employee-grades-api";
import { EmployeesApi } from "../../../api/employees/employees-api";
import { GradesApi } from "../../../api/grades/grades-api";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";
import AddCommentModal from "../../../components/modals/employee-grades/AddCommentModal";
import { EmployeeInterface } from "../../../components/modals/SubjectEditModal";

export default function EmployeeGrades() {
  const [error, setError] = useState("");
  const [addCommentModalActive, setAddCommentModalActive] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<EmployeeGradeInterface>();

  const { status, data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  const {
    status: employeesStatus,
    data: employees,
    refetch: refetchEmployees,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: EmployeesApi.getAll,
  });

  const { data: grades, refetch: refetchGrades } = useQuery({
    queryKey: ["grades"],
    queryFn: () => EmployeeGradesApi.getByStudent(authUser?.data.Student?.id),
    enabled: authUser?.data.Student?.id !== undefined,
  });

  if (employeesStatus === "loading") return <Loader active={true} />;
  if (employeesStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  interface StarsProps {
    employeeId: string;
  }

  function Stars({ employeeId }: StarsProps) {
    const found = grades?.data.find(
      (grade: EmployeeGradeInterface) => grade.employeeId === employeeId
    );

    if (found === undefined)
      return (
        <div className="flex flex-row rating">
          {[...Array(5)].map((e, index: number) => (
            <div
              key={index}
              className="text-content cursor-pointer hover:text-info"
              onClick={() => addGrade(employeeId, index + 1)}
            >
              <FontAwesomeIcon icon={faStar} size="lg" />
            </div>
          ))}
        </div>
      );

    return (
      <div className="flex flex-row rating">
        {[...Array(5)].map((e, index: number) => (
          <div
            key={index}
            className={
              Number(found.value) > index
                ? "text-info cursor-pointer"
                : "text-content cursor-pointer"
            }
            onClick={() => updateGrade(found.id, index + 1)}
          >
            <FontAwesomeIcon icon={faStar} size="lg" />
          </div>
        ))}
      </div>
    );
  }

  interface CommentProps {
    employeeId: string;
  }

  function Comment({ employeeId }: CommentProps) {
    const found = grades?.data.find(
      (grade: EmployeeGradeInterface) => grade.employeeId === employeeId
    );

    if (found === undefined) {
      return (
        <button
          className="btn btn-info btn-outline"
          disabled
          title="Add a grade to the teacher"
        >
          <FontAwesomeIcon icon={faPenToSquare} size="lg" />
        </button>
      );
    }

    return (
      <button
        className="btn btn-info btn-outline"
        onClick={() => {
          setSelectedGrade(found);
          setAddCommentModalActive(true);
        }}
      >
        <FontAwesomeIcon icon={faPenToSquare} size="lg" />
      </button>
    );
  }

  const addGrade = async (employeeId: string, grade: number) => {
    const data: CreateEmployeeGradeInterface = {
      value: grade,
      employeeId: employeeId,
      studentId: authUser?.data.Student?.id,
    };

    await EmployeeGradesApi.create(data);

    await refetchGrades();
  };

  const updateGrade = async (id: string, grade: number) => {
    const data: UpdateEmployeeGradeInterface = {
      value: grade,
    };

    await EmployeeGradesApi.update(id, data);

    await refetchGrades();
  };

  return (
    <>
      <AddCommentModal
        active={addCommentModalActive}
        onActiveChange={(active) => {
          setAddCommentModalActive(active);
          refetchGrades();
        }}
        employeeGrade={selectedGrade}
      />
      <div className="flex flex-col justify-center items-center">
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">Grade Employees</h1>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <td></td>
                  <th>Employee</th>
                  <th>Grade</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {employees?.data.map(
                  (employee: EmployeeInterface, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{`${employee.user.name} ${employee.user.surname}`}</td>
                      <td>
                        <Stars employeeId={employee.id} />
                      </td>
                      <td>
                        <Comment employeeId={employee.id} />
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
