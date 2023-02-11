import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { SubjectsApi } from "../../api/subjects/subjects-api";
import Modal from "./Modal";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { EmployeesApi } from "../../api/employees/employees-api";
import ErrorAlert from "../alerts/ErrorAlert";
import Loader from "../Loader";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type SubjectEditModalProps = {
  active: boolean;
  modalSubjectAbbreviation: string;
  onActiveChange: (active: boolean) => void;
};

const animatedComponents = makeAnimated();

let employeeOptions: { value: string; label: string }[] = [];

export default function SubjectEditModal({
  active,
  modalSubjectAbbreviation,
  onActiveChange,
}: SubjectEditModalProps) {
  const [error, setError] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const {
    status: subjectStatus,
    data: subject,
    refetch,
  } = useQuery({
    queryKey: ["subject"],
    queryFn: () => SubjectsApi.getUnique(modalSubjectAbbreviation),
  });

  const {
    status: employeesStatus,
    data: employees,
    refetch: refetchEmployees,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: () => EmployeesApi.getAllNotInSubject(modalSubjectAbbreviation),
  });

  useEffect(() => {
    refetch();
  }, [active, refetch]);

  employeeOptions = [];
  employees?.data.forEach((employee: EmployeeInterface) => {
    employeeOptions.push({
      value: employee.id,
      label: `${employee.user.name} ${employee.user.surname}`,
    });
  });

  if (!active) return <></>;

  if (subjectStatus === "loading") return <Loader active={true} />;
  if (subjectStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  if (employeesStatus === "loading") return <Loader active={true} />;
  if (employeesStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  const handleSelectedEmployeesChange = (selected: any) => {
    setSelectedEmployees(selected);
  };

  const Employees = () => {
    if (subject.data.Employee_Subject === undefined) return <></>;

    if (subject.data.Employee_Subject.length === 0)
      return (
        <>
          <tr>
            <td className="text-center" colSpan={7}>
              No records found
            </td>
          </tr>
        </>
      );

    const removeEmployeeFromSubject = async (employeeId: string) => {
      await EmployeesApi.removeFromSubject(
        employeeId,
        modalSubjectAbbreviation
      );

      refetch();
      refetchEmployees();
    };

    return subject?.data.Employee_Subject?.map(
      (c: { employee: EmployeeInterface }, index: number) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{c.employee.user.name}</td>
          <td>{c.employee.user.surname}</td>
          <td>{c.employee.user.username}</td>
          <td>{c.employee.user.email}</td>
          <td>{c.employee.user.gsm === "" ? "/" : c.employee.user.gsm}</td>
          <td>
            <button
              className="btn btn-error"
              onClick={() => removeEmployeeFromSubject(c.employee.id)}
            >
              <FontAwesomeIcon icon={faTrashCan} size="lg" />
            </button>
          </td>
        </tr>
      )
    );
  };

  const addEmployees = async () => {
    await EmployeesApi.addToSubject(
      selectedEmployees,
      modalSubjectAbbreviation
    ).catch((e) => {
      setError(e.response.data.message ?? e.message);
    });

    refetch();
    refetchEmployees();

    setSelectedEmployees([]);
  };

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <Modal
        active={active}
        title={"Edit - " + modalSubjectAbbreviation}
        onActiveChange={(isActive) => {
          onActiveChange?.(isActive);
        }}
      >
        <div className="form-control w-full mb-12">
          <label className="label">
            <span className="label-text">Add Students:</span>
          </label>
          <div className="flex flex-row justify-center items-center ">
            <div className="w-full mr-5">
              <Select
                options={employeeOptions}
                closeMenuOnSelect={false}
                isMulti
                value={selectedEmployees}
                components={animatedComponents}
                onChange={handleSelectedEmployeesChange}
                styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
              />
            </div>
            <button className="btn btn-accent" onClick={addEmployees}>
              Add selected
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <tr>
                <td></td>
                <th>Name</th>
                <th>Surname</th>
                <th>Username</th>
                <th>Email</th>
                <th>Gsm</th>
                <th>remove from class</th>
              </tr>
            </thead>
            <tbody>
              <Employees />
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}

interface EmployeeInterface {
  id: string;
  user: {
    id: string;
    name: string;
    surname: string;
    email: string;
    gsm: string;
    username: string;
  };
}
