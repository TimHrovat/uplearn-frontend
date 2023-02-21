import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ClassesApi } from "../../../api/classes/classes-api";
import { StudentsApi } from "../../../api/students/students-api";
import ErrorAlert from "../../alerts/ErrorAlert";
import Loader from "../../Loader";
import Modal from "../Modal";
import makeAnimated from "react-select/animated";
import Select from "react-select";

export type StudentsModalProps = {
  active: boolean;
  modalClassName: string;
  onActiveChange: (active: boolean) => void;
};

const animatedComponents = makeAnimated();

let studentOptions: { value: string; label: string }[] = [];

export default function ClassStudentsModal({
  active,
  onActiveChange,
  modalClassName,
}: StudentsModalProps) {
  const [error, setError] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    status: classesStatus,
    data: currentClass,
    refetch,
  } = useQuery({
    queryKey: ["class"],
    queryFn: () => ClassesApi.getUnique(modalClassName),
  });

  const {
    status: studentsStatus,
    data: students,
    refetch: refetchStudents,
  } = useQuery({
    queryKey: ["students"],
    queryFn: StudentsApi.getAllWithoutClass,
  });

  useEffect(() => {
    refetch();
  }, [modalClassName, refetch]);

  if (!active) return <></>;

  if (classesStatus === "loading") return <Loader active={true} />;
  if (classesStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  if (studentsStatus === "loading") return <Loader active={true} />;
  if (studentsStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  studentOptions = [];
  students?.data.forEach(
    (student: StudentInterface) => {
      studentOptions.push({
        value: student.id,
        label: `${student.user.name} ${student.user.surname}`,
      });
    }
  );

  const handleSelectedStudentsChange = (selected: any) => {
    setSelectedStudents(selected);
  };

  const Students = () => {
    if (currentClass.data.Student === undefined) return <></>;

    if (currentClass.data.Student.length === 0)
      return (
        <>
          <tr>
            <td className="text-center" colSpan={7}>
              No records found
            </td>
          </tr>
        </>
      );

    const removeStudentFromClass = async (studentId: string) => {
      await StudentsApi.removeFromClass(studentId);

      refetch();
      refetchStudents();
    };

    return currentClass.data.Student.map(
      (c: StudentInterface, index: number) => (
        <tr key={c.id}>
          <td>{index + 1}</td>
          <td>{c.user.name}</td>
          <td>{c.user.surname}</td>
          <td>{c.user.username}</td>
          <td>{c.user.email}</td>
          <td>{c.user.gsm === "" ? "/" : c.user.gsm}</td>
          <td>
            <button
              className="btn btn-error"
              onClick={() => removeStudentFromClass(c.id)}
            >
              <FontAwesomeIcon icon={faTrashCan} size="lg" />
            </button>
          </td>
        </tr>
      )
    );
  };

  const addStudents = async () => {
    setLoading(true);

    const addedStudents = await ClassesApi.update(modalClassName, {
      students: selectedStudents,
    })
      .catch((e) => {
        setError(e.response.data.cause);
      })
      .finally(() => {
        setLoading(false);
      });

    if (!addedStudents) {
      if (error === "") setError("Something went wrong please try again later");
      return;
    }

    refetchStudents();
    refetch();

    setSelectedStudents([]);
  };

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <Modal
        active={active}
        title={"Students - " + modalClassName}
        onActiveChange={(isActive) => onActiveChange?.(isActive)}
      >
        <div className="form-control w-full mb-12">
          <label className="label">
            <span className="label-text">Add Students:</span>
          </label>
          <div className="flex flex-row justify-center items-center ">
            <div className="w-full mr-5">
              <Select
                options={studentOptions}
                closeMenuOnSelect={false}
                isMulti
                value={selectedStudents}
                components={animatedComponents}
                onChange={handleSelectedStudentsChange}
                styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
              />
            </div>
            <button className="btn btn-accent" onClick={addStudents}>
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
              <Students />
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}

interface StudentInterface {
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
