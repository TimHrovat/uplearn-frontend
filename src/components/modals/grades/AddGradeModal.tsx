import React, { useRef, useState } from "react";
import ErrorAlert from "../../alerts/ErrorAlert";
import Modal from "../Modal";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { CreateGradeInterface, GradesApi } from "../../../api/grades/grades-api";
import SuccessAlert from "../../alerts/SuccessAlert";

export type AddGradeModalProps = {
  active: boolean;
  studentId: string;
  subject: string;
  fullName: string;
  onActiveChange: (active: boolean) => void;
};
const animatedComponents = makeAnimated();
const gradeValues = [
  { value: 0, label: "NPS" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
];
const gradeTypeOptions = [
  { value: "WRITTEN", label: "written" },
  { value: "ORAL", label: "oral" },
  { value: "OTHER", label: "other" },
];

export default function AddGradeModal({
  active,
  studentId,
  subject,
  fullName,
  onActiveChange,
}: AddGradeModalProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedGrade, setSelectedGrade] = useState<number>();
  const [selectedType, setSelectedType] = useState<
    "WRITTEN" | "ORAL" | "OTHER"
  >("WRITTEN");
  const description = useRef<HTMLTextAreaElement>(null);

  const handleSelectedType = (selected: any) => {
    setSelectedType(selected.value);
  };

  if (!active) return <></>;

  const createGrade = async () => {
    if (selectedGrade === undefined) {
      setError("Please select a grade");
      return;
    }

    setLoading(true);

    const data: CreateGradeInterface = {
      studentId,
      subjectAbbreviation: subject,
      type: selectedType,
      value: selectedGrade,
      description:
        description.current === null ? "" : description.current.value,
    };

    await GradesApi.create(data)
      .then(() => {
        setSuccess("Grade has been added");
      })
      .catch((e) => {
        setError(e.response.data.message ?? e.message);
      })
      .finally(() => {
        setLoading(false);
        setSelectedGrade(undefined);
        onActiveChange(false);
      });

  };

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <SuccessAlert
        msg={success}
        onVisibilityChange={(msg) => setSuccess(msg)}
      />
      <Modal
        active={active}
        title={"Grade student - " + fullName}
        onActiveChange={(isActive) => onActiveChange?.(isActive)}
      >
        <div className="form-control mb-10 w-[10rem]">
          <label className="label">
            <span className="label-text">Type:</span>
          </label>
          <Select
            options={gradeTypeOptions}
            closeMenuOnSelect={true}
            components={animatedComponents}
            onChange={handleSelectedType}
            defaultValue={{ value: "WRITTEN", label: "written" }}
            styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
          />
        </div>
        <div className="flex flex-row mb-5">
          {gradeValues.map((grade, index: number) => (
            <button
              key={index}
              className={
                selectedGrade === grade.value
                  ? "btn btn-info btn-outline mr-2 btn-active"
                  : "btn btn-info btn-outline mr-2"
              }
              onClick={() => setSelectedGrade(grade.value)}
            >
              {grade.label}
            </button>
          ))}
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
        <button
          className={
            loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
          }
          onClick={createGrade}
        >
          Add Grade
        </button>
      </Modal>
    </>
  );
}
