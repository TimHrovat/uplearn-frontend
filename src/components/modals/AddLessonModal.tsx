import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { ClassroomApi } from "../../api/classroom/classroom-api";
import Modal from "./Modal";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { ClassesApi } from "../../api/classes/classes-api";
import { SubjectInterface } from "./ClassAssignTeacherToSubjectModal";
import {
  CreateLessonInterface,
  LessonsApi,
} from "../../api/lessons/lessons-api";
import ErrorAlert from "../alerts/ErrorAlert";
import { EmployeesApi } from "../../api/employees/employees-api";
import SuccessAlert from "../alerts/SuccessAlert";

export type AddLessonModalProps = {
  active: boolean;
  date: string;
  schoolHourId: string;
  className: string;
  onActiveChange: (active: boolean) => void;
};

const animatedComponents = makeAnimated();
let classroomOptions: { value: string; label: string }[] = [];
let substituteEmployeeOptions: { value: string; label: string }[] = [];
let subjectOptions: {
  value: { employeeId: string; subjectAbbreviation: string };
  label: string;
}[] = [];
let lessonTypeOptions: { value: string; label: string }[] = [
  { value: "NORMAL", label: "normal" },
  { value: "SUBSTITUTE", label: "substitute" },
  { value: "GRADING", label: "grading" },
];

export default function AddLessonModal({
  active,
  onActiveChange,
  date,
  schoolHourId,
  className,
}: AddLessonModalProps) {
  const [selectedClassroomName, setSelectedClassroomName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubject, setSelectedSubject] = useState({
    employeeId: "",
    subjectAbbreviation: "",
  });
  const [substituteEmployeeId, setSubstituteEmployeeId] = useState("");
  const description = useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [substituteView, setSubstituteView] = useState(false);

  const { data: classrooms } = useQuery({
    queryKey: ["classrooms"],
    queryFn: () => ClassroomApi.whereNotInLesson(date, schoolHourId),
  });

  const { data: currentClass } = useQuery({
    queryKey: ["class"],
    queryFn: () => ClassesApi.getUnique(className),
  });

  const { data: substituteEmployees } = useQuery({
    queryKey: ["employees"],
    queryFn: () => EmployeesApi.getAll(),
  });

  classroomOptions = [];
  classrooms?.data.forEach((classroom: { name: string; type: string }) => {
    classroomOptions.push({
      value: classroom.name,
      label: `${classroom.name} (${classroom.type})`,
    });
  });

  substituteEmployeeOptions = [];
  substituteEmployees?.data.forEach(
    (employee: { id: string; user: { surname: string; name: string } }) => {
      substituteEmployeeOptions.push({
        value: employee.id,
        label: `${employee.user.name} ${employee.user.surname}`,
      });
    }
  );

  subjectOptions = [];
  currentClass?.data.subjectList.Subject_SubjectList.forEach(
    (subj: SubjectInterface) => {
      currentClass?.data.Employee_Subject_Class.forEach(
        (assignedSubject: SubjectWithAssignedTeacher) => {
          if (
            subj.subject.abbreviation === assignedSubject.subjectAbbreviation
          ) {
            const user = assignedSubject.employee_Subject.employee.user;

            const data = {
              value: {
                employeeId: assignedSubject.employeeId,
                subjectAbbreviation: assignedSubject.subjectAbbreviation,
              },
              label: `${assignedSubject.subjectAbbreviation} (${user.name} ${user.surname})`,
            };

            subjectOptions.push(data);
          }
        }
      );
    }
  );

  const handleSelectedClassroom = (selected: any) => {
    setSelectedClassroomName(selected.value);
  };

  const handleSelectedSubstituteEmployee = (selected: any) => {
    setSubstituteEmployeeId(selected.value);
  };

  const handleSelectedType = (selected: any) => {
    setSelectedType(selected.value);

    if (selected.value === "SUBSTITUTE") setSubstituteView(true);
    else setSubstituteView(false);
  };

  const handleSelectedSubject = (selected: any) => {
    setSelectedSubject({
      employeeId: selected.value.employeeId,
      subjectAbbreviation: selected.value.subjectAbbreviation,
    });
  };

  const createLesson = async () => {
    setError("");
    setSuccess("");

    if (selectedType === "SUBSTITUTE" && substituteEmployeeId === "") {
      setError("You need to select a substitute teacher");
      return;
    }

    if (selectedType !== "SUBSTITUTE" && selectedSubject.employeeId === "") {
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
      employeeId: substituteView ? null : selectedSubject.employeeId,
      subjectAbbreviation: substituteView
        ? null
        : selectedSubject.subjectAbbreviation,
      substituteEmployeeId: substituteView ? substituteEmployeeId : null,
      className: className,
      classroomName: selectedClassroomName,
      schoolHourId: schoolHourId,
    };

    await LessonsApi.create(data)
      .then(() => {
        setSuccess("Lesson has been created successfully");
      })
      .catch((e) => {
        console.log(e);
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
      <SuccessAlert msg={success} onVisibilityChange={(msg) => setSuccess(msg)} />
      <Modal
        active={active}
        title={"Add lesson"}
        onActiveChange={(isActive) => onActiveChange?.(isActive)}
        fullWidth={true}
      >
        <div>{schoolHourId}</div>
        <div>{date}</div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Description:</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full"
            ref={description}
          ></textarea>
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
        {substituteView ? (
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Employee:</span>
            </label>
            <Select
              options={substituteEmployeeOptions}
              closeMenuOnSelect={true}
              components={animatedComponents}
              onChange={handleSelectedSubstituteEmployee}
              styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
            />
          </div>
        ) : (
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Subject:</span>
            </label>
            <Select
              options={subjectOptions}
              closeMenuOnSelect={true}
              components={animatedComponents}
              onChange={handleSelectedSubject}
              styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
            />
          </div>
        )}

        <button
          className={
            loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
          }
          onClick={createLesson}
        >
          Create Lesson
        </button>
      </Modal>
    </>
  );
}

interface SubjectWithAssignedTeacher {
  employeeId: string;
  subjectAbbreviation: string;
  employee_Subject: {
    employee: {
      user: {
        name: string;
        surname: string;
      };
    };
  };
}
