import React, { useRef, useState } from "react";
import {
  EmployeeGradeInterface,
  EmployeeGradesApi,
  UpdateEmployeeGradeInterface,
} from "../../../api/employee-grades/employee-grades-api";
import Modal from "../Modal";

interface AddCommentModalProps {
  active: boolean;
  employeeGrade: EmployeeGradeInterface | undefined;
  onActiveChange: (active: boolean) => void;
}

export default function AddCommentModal({
  active,
  onActiveChange,
  employeeGrade,
}: AddCommentModalProps) {
  const comment = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);

  const updateGrade = async () => {
    if (!employeeGrade || !active) return;

    setLoading(true);

    const data: UpdateEmployeeGradeInterface = {
      comment: comment.current === null ? "" : comment.current.value,
    };

    await EmployeeGradesApi.update(employeeGrade.id, data).finally(() => {
      setLoading(false);
      onActiveChange(false);
    });
  };

  if (!employeeGrade || !active) return <></>;

  return (
    <Modal
      active={active}
      title={"Edit Comment"}
      onActiveChange={(isActive) => {
        onActiveChange?.(isActive);
      }}
    >
      <div className="form-control w-full mb-5">
        <label className="label">
          <span className="label-text">comment:</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24 w-full"
          defaultValue={employeeGrade.comment}
          ref={comment}
        ></textarea>
      </div>
      <button
        className={
          loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
        }
        onClick={updateGrade}
      >
        Save
      </button>
    </Modal>
  );
}
