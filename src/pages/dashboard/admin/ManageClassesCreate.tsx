import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { SubjectListsApi } from "../../../api/subjects/subject-listst-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import { StudentsApi } from "../../../api/students/students-api";
import { EmployeesApi } from "../../../api/employees/employees-api";
import { ClassesApi, CreateClass } from "../../../api/classes/classes-api";
import { style } from "../../../components/ReactSelectStyle";
import PageOutline from "../../../components/pages/PageOutline";

let subjectListOptions: { value: string; label: string }[] = [];
let studentOptions: { value: string; label: string }[] = [];
let nonClassTeacherOptions: { value: string; label: string }[] = [];
let nonSubstituteClassTeacherOptions: { value: string; label: string }[] = [];
const animatedComponents = makeAnimated();

export default function ManageClassesCreate() {
  const [selectedSubjectList, setSelectedSubjectList] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedNonClassTeachers, setSelectedNonClassTeachers] = useState("");
  const [
    selectedNonSubstituteClassTeachers,
    setSelectedNonSubstituteClassTeachers,
  ] = useState("");

  const name = useRef<HTMLInputElement>(null);
  const [year, setYear] = useState("1");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { status: subjectListStatus, data: subjectLists } = useQuery({
    queryKey: ["subjectLists"],
    queryFn: SubjectListsApi.getAll,
  });

  const {
    status: studentsStatus,
    data: students,
    refetch: refetchStudents,
  } = useQuery({
    queryKey: ["students"],
    queryFn: StudentsApi.getAllWithoutClass,
  });

  const {
    status: nonClassTeachersStatus,
    data: nonClassTeachers,
    refetch: refetchClassTeachers,
  } = useQuery({
    queryKey: ["nonClassTeachers"],
    queryFn: EmployeesApi.getNonClassTeachers,
  });

  const {
    status: nonSubstituteClassTeachersStatus,
    data: nonSubstituteClassTeachers,
    refetch: refetchSubstituteClassTeachers,
  } = useQuery({
    queryKey: ["nonSubstituteClassTeachers"],
    queryFn: EmployeesApi.getNonSubstituteClassTeachers,
  });

  if (
    subjectListStatus === "loading" ||
    studentsStatus === "loading" ||
    nonClassTeachersStatus === "loading" ||
    nonSubstituteClassTeachersStatus === "loading"
  )
    return <Loader active={true} />;
  if (
    subjectListStatus === "error" ||
    studentsStatus === "error" ||
    nonClassTeachersStatus === "error" ||
    nonSubstituteClassTeachersStatus === "error"
  )
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  subjectListOptions = [];
  subjectLists?.data.forEach((subjectList: { name: string; id: string }) => {
    subjectListOptions.push({
      value: subjectList.id,
      label: `${subjectList.name}`,
    });
  });

  studentOptions = [];
  students?.data.forEach(
    (student: {
      id: string;
      user: { id: string; name: string; surname: string };
    }) => {
      studentOptions.push({
        value: student.id,
        label: `${student.user.name} ${student.user.surname}`,
      });
    }
  );

  nonClassTeacherOptions = [];
  nonClassTeachers?.data.forEach(
    (teacher: {
      id: string;
      user: { id: string; name: string; surname: string };
    }) => {
      nonClassTeacherOptions.push({
        value: teacher.id,
        label: `${teacher.user.name} ${teacher.user.surname}`,
      });
    }
  );

  nonSubstituteClassTeacherOptions = [];
  nonSubstituteClassTeachers?.data.forEach(
    (teacher: {
      id: string;
      user: { id: string; name: string; surname: string };
    }) => {
      nonSubstituteClassTeacherOptions.push({
        value: teacher.id,
        label: `${teacher.user.name} ${teacher.user.surname}`,
      });
    }
  );

  const handleSelectedSubjectListChange = (selected: any) => {
    setSelectedSubjectList(selected.value);
  };

  const handleSelectedStudentsChange = (selected: any) => {
    setSelectedStudents(selected);
  };

  const handleSelectedNonClassTeacherChange = (selected: any) => {
    setSelectedNonClassTeachers(selected.value);
  };

  const handleSelectedNonSubstituteClassTeacherChange = (selected: any) => {
    setSelectedNonSubstituteClassTeachers(selected.value);
  };

  const isValidYear = (year: string) => {
    return /^[1-9]?$/.test(year);
  };

  const handleYearChange = (el: React.FormEvent<HTMLInputElement>) => {
    let newValue = el.currentTarget.value;

    if (isValidYear(newValue)) {
      if (newValue.length > 1) {
        newValue = newValue[0];
      }

      if (newValue.length === 0) {
        setYear("");
        return;
      }

      setYear(newValue);
    }
  };

  const createClass = async () => {
    setError("");
    setSuccess("");

    if (name.current && name.current.value === "") {
      setError("You need to povide a name for the class");
      return;
    }

    if (year === "") {
      setError("Year cannot be empty");
      return;
    }

    if (selectedSubjectList.length === 0) {
      setError("You need to select a subject list");
      return;
    }

    if (selectedNonClassTeachers.length === 0) {
      setError("You need to select a class teacher");
      return;
    }

    if (selectedNonSubstituteClassTeachers.length === 0) {
      setError("You need to select a substitute class teacher");
      return;
    }

    if (selectedNonClassTeachers === selectedNonSubstituteClassTeachers) {
      setError("Class teacher and substitute class teacher cannot be the same");
      return;
    }

    const data: CreateClass = {
      name: name.current === null ? "" : name.current.value,
      year: Number(year),
      subjectListId: selectedSubjectList,
      students: selectedStudents,
      classTeacherId: selectedNonClassTeachers,
      substituteClassTeacherId: selectedNonSubstituteClassTeachers,
    };

    setLoading(true);

    const newClass = await ClassesApi.create(data)
      .catch((e) => {
        setError(
          e.response.data.cause ?? "Something went wrong please try again later"
        );
      })
      .finally(() => {
        setLoading(false);
      });

    if (!newClass) {
      if (error === "") setError("Something went wrong please try again later");
      return;
    }

    refetchClassTeachers();
    refetchSubstituteClassTeachers();
    refetchStudents();

    setSuccess("New class has been created");
  };

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <SuccessAlert
        msg={success}
        onVisibilityChange={(msg) => setSuccess(msg)}
      />
      <PageOutline
        title="Create Class"
        navigationElements={[
          { title: "View classes", link: "/dashboard/manage-classes" },
          { title: "Create class", link: "/dashboard/manage-classes/create" },
        ]}
      >
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Name:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            ref={name}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Year:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={year}
            onChange={handleYearChange}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Subject Lists:</span>
          </label>
          <Select
            options={subjectListOptions}
            closeMenuOnSelect={true}
            components={animatedComponents}
            onChange={handleSelectedSubjectListChange}
            styles={style}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Students:</span>
          </label>
          <Select
            options={studentOptions}
            closeMenuOnSelect={false}
            isMulti
            components={animatedComponents}
            onChange={handleSelectedStudentsChange}
            styles={style}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Class Teacher:</span>
          </label>
          <Select
            options={nonClassTeacherOptions}
            closeMenuOnSelect={true}
            components={animatedComponents}
            onChange={handleSelectedNonClassTeacherChange}
            styles={style}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Substitute Class Teacher:</span>
          </label>
          <Select
            options={nonSubstituteClassTeacherOptions}
            closeMenuOnSelect={true}
            components={animatedComponents}
            onChange={handleSelectedNonSubstituteClassTeacherChange}
            styles={style}
          />
        </div>
        <button
          className={
            loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
          }
          onClick={createClass}
        >
          Create Class
        </button>
      </PageOutline>
    </>
  );
}
