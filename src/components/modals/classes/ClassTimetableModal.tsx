import React, { useState } from "react";
import ErrorAlert from "../../alerts/ErrorAlert";
import Timetable from "../../timetable/Timetable";
import Modal from "../Modal";

export type ClassTimetableModalProps = {
  active: boolean;
  modalClassName: string;
  onActiveChange: (active: boolean) => void;
};

export default function ClassTimetableModal({
  active,
  onActiveChange,
  modalClassName,
}: ClassTimetableModalProps) {
  const [error, setError] = useState("");

  if (!active) return <></>;

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <Modal
        active={active}
        title={"Timetable - " + modalClassName}
        onActiveChange={(isActive) => onActiveChange?.(isActive)}
        fullWidth={true}
      >
        <Timetable classNameP={modalClassName}/>
      </Modal>
    </>
  );
}
