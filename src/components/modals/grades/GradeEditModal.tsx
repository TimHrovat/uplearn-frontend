import React, { useState } from "react";
import { GradesApi } from "../../../api/grades/grades-api";
import ErrorAlert from "../../alerts/ErrorAlert";
import SuccessAlert from "../../alerts/SuccessAlert";
import Modal from "../Modal";

export type GradeEditModalProps = {
  active: boolean;
  gradeId: string;
  currentGrade: number;
  onActiveChange: (active: boolean) => void;
};

const gradeValues = [
  { value: 0, label: "NPS" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
];

export default function GradeEditModal({
  active,
  gradeId,
  currentGrade,
  onActiveChange,
}: GradeEditModalProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<number>(currentGrade);

  if (!active) return <></>;

  const updateGrade = async () => {
    if (selectedGrade === undefined) {
      setError("Please select a grade");
      return;
    }

    await GradesApi.update(gradeId, { value: selectedGrade })
      .then(() => {
        setSuccess("Grade has been updated");
        onActiveChange(false);
      })
      .catch((e) => {
        setError(e.response.data.message ?? e.message);
      })
      .finally(() => {
        setLoading(false);
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
        title={"Update grade"}
        onActiveChange={(isActive) => onActiveChange?.(isActive)}
      >
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
        <button
          className={
            loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
          }
          onClick={updateGrade}
        >
          Update Grade
        </button>
      </Modal>
    </>
  );
}
