import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { ClassroomApi } from "../../api/classroom/classroom-api";
import Modal from "./Modal";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import ErrorAlert from "../alerts/ErrorAlert";
import SuccessAlert from "../alerts/SuccessAlert";
import { ClassesApi } from "../../api/classes/classes-api";
import Loader from "../Loader";
import {
  CreateLessonInterface,
  LessonsApi,
} from "../../api/lessons/lessons-api";

export type AddEmployeeLessonModalProps = {
  active: boolean;
  date: string;
  schoolHourId: string;
  employeeId: string;
  onActiveChange: (active: boolean) => void;
};

const animatedComponents = makeAnimated();
let classroomOptions: { value: string; label: string }[] = [];
let classOptions: { value: string; label: string }[] = [];
let subjectOptions: {
  value: string;
  label: string;
}[] = [];
let lessonTypeOptions: { value: string; label: string }[] = [
  { value: "NORMAL", label: "normal" },
  { value: "GRADING", label: "grading" },
];

export default function AddEmployeeLessonModal({
  active,
  onActiveChange,
  date,
  employeeId,
  schoolHourId,
}: AddEmployeeLessonModalProps) {
  const [selectedClassroomName, setSelectedClassroomName] = useState("");
  const [selectedType, setSelectedType] = useState("NORMAL");
  const [selectedSubjectAbbr, setSelectedSubjectAbbr] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [createMany, setCreateMany] = useState(false);
  const description = useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { status: classroomsStatus, data: classrooms } = useQuery({
    queryKey: ["classrooms"],
    queryFn: () => ClassroomApi.whereNotInLesson(date, schoolHourId),
  });

  const { status: classesStatus, data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: () => ClassesApi.getByEmployee(employeeId),
  });

  if (classroomsStatus === "loading" || classesStatus === "loading")
    return <Loader active={true} />;
  if (classroomsStatus === "error" || classesStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  classroomOptions = [];
  classrooms?.data.forEach((classroom: { name: string; type: string }) => {
    classroomOptions.push({
      value: classroom.name,
      label: `${classroom.name} (${classroom.type})`,
    });
  });

  classOptions = [];
  classes?.data.forEach((classOption: { name: string }) => {
    classOptions.push({
      value: classOption.name,
      label: classOption.name,
    });
  });

  console.log(classes?.data);

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

  const handleSelectedClassroom = (selected: any) => {
    setSelectedClassroomName(selected.value);
  };

  const handleSelectedType = (selected: any) => {
    setSelectedType(selected.value);
  };

  const handleSelectedSubject = (selected: any) => {
    setSelectedSubjectAbbr(selected.value);
  };

  const handleSelectedClass = (selected: any) => {
    setSelectedClass(selected.value);

    subjectOptions = [];

    setSelectedSubjectAbbr("");
  };

  const createLesson = async () => {
    setError("");
    setSuccess("");

    if (selectedClass === "") {
      setError("You need to select a class");
      return;
    }

    if (selectedSubjectAbbr === "") {
      setError("You need to select a subject");
      return;
    }

    if (selectedType === "") {
      setError("You need to select a type");
      return;
    }

    if (selectedClassroomName === "") {
      setError("You need to select a classroom");
      return;
    }
    setLoading(true);
    const data: CreateLessonInterface = {
      description:
        description.current === null ? "" : description.current.value,
      date: date,
      type: selectedType,
      employeeId: employeeId,
      subjectAbbreviation: selectedSubjectAbbr,
      className: selectedClass,
      classroomName: selectedClassroomName,
      schoolHourId: schoolHourId,
    };
    if (createMany) {
      await LessonsApi.createMany(data)
        .then(() => {
          setSuccess("Lessons have been created successfully");
        })
        .catch((e) => {
          setError(e.response.data.message ?? e.message);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }
    await LessonsApi.create(data)
      .then(() => {
        setSuccess("Lesson has been created successfully");
      })
      .catch((e) => {
        setError(e.response.data.message ?? e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!active) return <></>;

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <SuccessAlert
        msg={success}
        onVisibilityChange={(msg) => setSuccess(msg)}
      />
      <Modal
        active={active}
        title={"Add lesson"}
        onActiveChange={(isActive) => onActiveChange?.(isActive)}
      >
        <div className="form-control w-full mb-5">
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
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Subject:</span>
          </label>
          <Select
            options={subjectOptions}
            closeMenuOnSelect={true}
            isDisabled={selectedClass === ""}
            components={animatedComponents}
            onChange={handleSelectedSubject}
            styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Type:</span>
          </label>
          <Select
            options={lessonTypeOptions}
            closeMenuOnSelect={true}
            components={animatedComponents}
            onChange={handleSelectedType}
            defaultValue={{ value: "NORMAL", label: "normal" }}
            styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Classroom:</span>
          </label>
          <Select
            options={classroomOptions}
            closeMenuOnSelect={true}
            components={animatedComponents}
            onChange={handleSelectedClassroom}
            styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Description:</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full"
            ref={description}
          ></textarea>
        </div>
        <div className="form-control">
          <label className="cursor-pointer label tablet:w-1/3 w-full">
            <span className="label-text mr-10">
              Create lessons until the end of school year?
            </span>
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={createMany}
              onChange={() => setCreateMany(!createMany)}
            />
          </label>
        </div>
        <button
          className={
            loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
          }
          onClick={createLesson}
        >
          Create
        </button>
      </Modal>
    </>
  );
}
