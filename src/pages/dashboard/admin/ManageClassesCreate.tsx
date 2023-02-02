import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { SubjectListsApi } from "../../../api/subjects/subject-listst-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import { StudentsApi } from "../../../api/students/students-api";
import { EmployeesApi } from "../../../api/employees/employees-api";
import { ClassesApi, CreateClass } from "../../../api/classes/classes-api";

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
  const [year, setYear] = useState(1);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { status: subjectListStatus, data: subjectLists } = useQuery({
    queryKey: ["subjectLists"],
    queryFn: SubjectListsApi.getAll,
  });

  const { status: studentsStatus, data: students, refetch: refetchStudents } = useQuery({
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

  if (subjectListStatus === "loading") return <Loader active={true} />;
  if (subjectListStatus === "error")
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

  if (nonClassTeachersStatus === "loading") return <Loader active={true} />;
  if (nonClassTeachersStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  if (nonSubstituteClassTeachersStatus === "loading")
    return <Loader active={true} />;
  if (nonSubstituteClassTeachersStatus === "error")
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

  const handleYearChange = (el: React.FormEvent<HTMLInputElement>) => {
    let newValue = el.currentTarget.value;
    if (newValue.length > 1) {
      newValue = newValue.slice(0, 1);
    }

    setYear(Number(newValue));
  };

  const createClass = async () => {
    setError("");
    setSuccess("");

    if (name.current && name.current.value === "") {
      setError("You need to povide a name for the subject list");
      return;
    }

    if (year === 0) {
      setError("Year cannot be 0");
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
      year,
      subjectListId: selectedSubjectList,
      students: selectedStudents,
      classTeacherId: selectedNonClassTeachers,
      substituteClassTeacherId: selectedNonSubstituteClassTeachers,
    };

    setLoading(true);

    const newClass = await ClassesApi.create(data)
      .catch((e) => {
        setError(e.response.data.cause);
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
      <div className="flex flex-col justify-center items-center">
        <SubpageBtnList
          buttons={[
            { title: "View classes", link: "/dashboard/manage-classes" },
            { title: "Create class", link: "/dashboard/manage-classes/create" },
          ]}
        />
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">Create Class</h1>
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
              type="number"
              className="input input-bordered w-full"
              value={year}
              onChange={handleYearChange}
              pattern="[1-9]"
              min="1"
              max="9"
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
              styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
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
              styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
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
              styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
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
              styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
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
        </div>
      </div>
    </>
  );
}
