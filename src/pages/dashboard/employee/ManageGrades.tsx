import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { AuthApi } from "../../../api/auth/auth-api";
import { ClassesApi } from "../../../api/classes/classes-api";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import Loader from "../../../components/Loader";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { StudentsApi } from "../../../api/students/students-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import AddGradeModal from "../../../components/modals/grades/AddGradeModal";

const animatedComponents = makeAnimated();
let classOptions: { value: string; label: string }[] = [];
let subjectOptions: { value: string; label: string }[] = [];

export default function ManageGrades() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubjectAbbr, setSelectedSubjectAbbr] = useState("");

  const [addGradeModalActive, setAddGradeModalActive] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({
    id: "",
    fullName: "",
  });

  const { status: authUserStatus, data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  const {
    status: classesStatus,
    data: classes,
    refetch: refetchClasses,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      if (AuthApi.isAdmin()) return await ClassesApi.getAll();
      else return await ClassesApi.getByEmployee(authUser?.data.Employee?.id);
    },
    enabled: authUser?.data !== undefined,
  });

  const {
    status: studentsStatus,
    data: students,
    refetch: refetchStudents,
  } = useQuery({
    queryKey: ["students"],
    queryFn: async () =>
      StudentsApi.getByClassAndSubject(selectedClass, selectedSubjectAbbr),
    enabled: selectedClass !== "" && selectedSubjectAbbr !== "",
  });

  useEffect(() => {
    if (selectedClass !== "" && selectedSubjectAbbr !== "") refetchStudents();
  }, [refetchStudents, selectedClass, selectedSubjectAbbr]);

  if (classesStatus === "loading" || authUserStatus === "loading")
    return <Loader active={true} />;
  if (classesStatus === "error" || authUserStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  classOptions = [];
  classes?.data.forEach((classOption: { name: string }) => {
    classOptions.push({
      value: classOption.name,
      label: classOption.name,
    });
  });

  if (selectedClass !== "") {
    subjectOptions = [];

    const foundClass = classes?.data.find(
      (classOption: { name: string }) => classOption.name === selectedClass
    );

    foundClass.Employee_Subject_Class.forEach(
      (item: { subjectAbbreviation: string }) => {
        subjectOptions.push({
          value: item.subjectAbbreviation,
          label: item.subjectAbbreviation,
        });
      }
    );
  }

  const handleSelectedSubject = (selected: any) => {
    setSelectedSubjectAbbr(selected.value);
  };

  const handleSelectedClass = (selected: any) => {
    setSelectedClass(selected.value);

    subjectOptions = [];

    setSelectedSubjectAbbr("");

    refetchClasses();
  };

  const calcAvgGrade = (grades: GradeInterface[]) => {
    let len = 0;

    grades.forEach((grade) => {
      if (grade.value !== 0) len++;
    });

    if (len === 0) return "/";

    return grades.reduce((sum, grade) => sum + grade.value, 0) / len;
  };

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <SuccessAlert
        msg={success}
        onVisibilityChange={(msg) => setSuccess(msg)}
      />
      <AddGradeModal
        active={addGradeModalActive}
        studentId={currentStudent.id}
        fullName={currentStudent.fullName}
        subject={selectedSubjectAbbr}
        onActiveChange={(active) => {
          setAddGradeModalActive(active);
          refetchStudents();
        }}
      />
      <div className="flex flex-col justify-center items-center">
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">Gradebook</h1>
          <div className="flex flex-row">
            <div className="form-control mb-5 mr-5 min-w-[10rem]">
              <label className="label">
                <span className="label-text">Class:</span>
              </label>
              <Select
                options={classOptions}
                closeMenuOnSelect={true}
                components={animatedComponents}
                onChange={handleSelectedClass}
                styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
              />
            </div>
            <div className="form-control mb-5 min-w-[10rem]">
              <label className="label">
                <span className="label-text">Subject:</span>
              </label>
              <Select
                options={subjectOptions}
                closeMenuOnSelect={true}
                isDisabled={selectedClass === ""}
                components={animatedComponents}
                onChange={handleSelectedSubject}
                {...(selectedSubjectAbbr === "" ? { value: null } : {})}
                styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <td></td>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Username</th>
                  <th>Grades</th>
                  <th>Avg</th>
                  <th>View</th>
                  <th>Add</th>
                </tr>
              </thead>
              <tbody>
                {selectedSubjectAbbr === "" ? (
                  <tr>
                    <td colSpan={7} className="text-center">
                      Select a class and a subject to view grades
                    </td>
                  </tr>
                ) : (
                  students?.data.map(
                    (student: StudentInterface, index: number) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{student.user.name}</td>
                        <td>{student.user.surname}</td>
                        <td>{student.user.username}</td>
                        <td>
                          <div className="flex flex-row">
                            {student.Grade.map(
                              (grade: GradeInterface, index: number) => (
                                <span key={index} className="mr-2">
                                  {grade.value === 0 ? "NPS" : grade.value}
                                </span>
                              )
                            )}
                          </div>
                        </td>
                        <td>{calcAvgGrade(student.Grade)}</td>
                        <td>
                          <button className="btn btn-outline btn-info">
                            <FontAwesomeIcon icon={faEye} size="lg" />
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-outline btn-info"
                            onClick={() => {
                              setCurrentStudent({
                                id: student.id,
                                fullName: `${student.user.name} ${student.user.surname}`,
                              });
                              setAddGradeModalActive(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faAdd} size="lg" />
                          </button>
                        </td>
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

interface StudentInterface {
  id: string;
  userId: string;
  user: {
    name: string;
    surname: string;
    username: string;
  };
  Grade: [GradeInterface];
}

interface GradeInterface {
  value: number;
  type: "ORAL" | "WRITTEN" | "OTHER";
  description: string;
}
