import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ClassesApi, UpdateClass } from "../../../api/classes/classes-api";
import ErrorAlert from "../../alerts/ErrorAlert";
import Loader from "../../Loader";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import Modal from "../Modal";
import { EmployeesApi } from "../../../api/employees/employees-api";
import { SubjectListsApi } from "../../../api/subjects/subject-listst-api";

export type ClassEditModalProps = {
  active: boolean;
  modalClassName: string;
  onActiveChange: (active: boolean) => void;
};

const animatedComponents = makeAnimated();

let subjectListOptions: { value: string; label: string }[] = [];
let nonClassTeacherOptions: { value: string; label: string }[] = [];
let nonSubstituteClassTeacherOptions: { value: string; label: string }[] = [];

export default function ClassEditModal({
  active,
  onActiveChange,
  modalClassName,
}: ClassEditModalProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedSubjectList, setSelectedSubjectList] = useState("");
  const [selectedNonClassTeachers, setSelectedNonClassTeachers] = useState("");
  const [
    selectedNonSubstituteClassTeachers,
    setSelectedNonSubstituteClassTeachers,
  ] = useState("");

  const [year, setYear] = useState("1");
  const [name, setName] = useState("");

  const {
    status: classesStatus,
    data: currentClass,
    refetch,
  } = useQuery({
    queryKey: ["class-edit"],
    queryFn: () => ClassesApi.getUnique(modalClassName),
  });

  const { status: subjectListStatus, data: subjectLists } = useQuery({
    queryKey: ["subjectLists"],
    queryFn: SubjectListsApi.getAll,
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

  useEffect(() => {
    refetch();
  }, [active, refetch]);

  if (!active) return <></>;

  if (
    classesStatus === "loading" ||
    subjectListStatus === "loading" ||
    nonClassTeachersStatus === "loading" ||
    nonSubstituteClassTeachersStatus === "loading"
  )
    return <Loader active={true} />;
  if (
    classesStatus === "error" ||
    subjectListStatus === "error" ||
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

  const updateClass = async () => {
    setError("");

    if (
      selectedNonClassTeachers === selectedNonSubstituteClassTeachers &&
      (selectedNonClassTeachers !== "" ||
        selectedNonSubstituteClassTeachers !== "")
    ) {
      setError("Class teacher and substitute class teacher cannot be the same");
      return;
    }

    if (
      currentClass.data.classTeacher.id ===
        selectedNonSubstituteClassTeachers ||
      currentClass.data.substituteClassTeacher.id === selectedNonClassTeachers
    ) {
      setError("Class teacher and substitute class teacher cannot be the same");
      return;
    }

    const data: UpdateClass = {
      name: name === "" ? modalClassName : name,
      year: Number(year) === 0 ? Number(currentClass.data.year) : Number(year),
      subjectListId:
        selectedSubjectList === ""
          ? currentClass.data.subjectList.id
          : selectedSubjectList,
      classTeacherId:
        selectedNonClassTeachers === ""
          ? currentClass.data.classTeacher.id
          : selectedNonClassTeachers,
      substituteClassTeacherId:
        selectedNonSubstituteClassTeachers === ""
          ? currentClass.data.substituteClassTeacher.id
          : selectedNonSubstituteClassTeachers,
    };

    setLoading(true);

    const newClass = await ClassesApi.update(modalClassName, data)
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
    refetch();
  };

  if (currentClass.data.classTeacher === undefined) return <></>;

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <Modal
        active={active}
        title={"Edit - " + modalClassName}
        onActiveChange={(isActive) => {
          onActiveChange?.(isActive);
        }}
      >
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Name:</span>
          </label>
          <input
            type="text"
            value={name === "" ? currentClass.data.name : name}
            onChange={(e) => setName(e.currentTarget.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Year:</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={year === "1" ? currentClass.data.year : year}
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
            defaultValue={{
              value: currentClass.data.subjectList.id,
              label: currentClass.data.subjectList.name,
            }}
            styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Class Teacher:</span>
          </label>
          <Select
            options={[
              ...nonClassTeacherOptions,
              {
                value: currentClass.data.classTeacher.id,
                label: `${currentClass.data.classTeacher.user.name} ${currentClass.data.classTeacher.user.surname}`,
              },
            ]}
            closeMenuOnSelect={true}
            components={animatedComponents}
            onChange={handleSelectedNonClassTeacherChange}
            defaultValue={{
              value: currentClass.data.classTeacher.id,
              label: `${currentClass.data.classTeacher.user.name} ${currentClass.data.classTeacher.user.surname}`,
            }}
            styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Substitute Class Teacher:</span>
          </label>
          <Select
            options={[
              ...nonSubstituteClassTeacherOptions,
              {
                value: currentClass.data.substituteClassTeacher.id,
                label: `${currentClass.data.substituteClassTeacher.user.name} ${currentClass.data.substituteClassTeacher.user.surname}`,
              },
            ]}
            closeMenuOnSelect={true}
            components={animatedComponents}
            onChange={handleSelectedNonSubstituteClassTeacherChange}
            defaultValue={{
              value: currentClass.data.substituteClassTeacher.id,
              label: `${currentClass.data.substituteClassTeacher.user.name} ${currentClass.data.substituteClassTeacher.user.surname}`,
            }}
            styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
          />
        </div>
        <button
          className={
            loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
          }
          onClick={updateClass}
        >
          Save Changes
        </button>
      </Modal>
    </>
  );
}
