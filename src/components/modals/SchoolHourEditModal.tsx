import React, { useRef, useState } from "react";
import {
  SchoolHoursApi,
  UpdateSchoolHour,
} from "../../api/school-hours/school-hours-api";
import ErrorAlert from "../alerts/ErrorAlert";
import Modal from "./Modal";

export type SchoolHourEditModalProps = {
  active: boolean;
  modalSchoolHourId: string;
  onActiveChange: (active: boolean) => void;
};

export default function SchoolHourEditModal({
  active,
  modalSchoolHourId,
  onActiveChange,
}: SchoolHourEditModalProps) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const time = useRef<HTMLInputElement>(null);

  const updateSchoolHour = async () => {
    setError("");

    if (time.current?.value === "") {
      setError("Please provide a starting time for the school hour");
      return;
    }

    setLoading(true);

    const data: UpdateSchoolHour = {
      startTime: time.current?.value + ":00",
    };

    const newSchoolHour = await SchoolHoursApi.update(modalSchoolHourId, data)
      .catch((e) => {
        setError(
          e.response.data.message ??
            "Something went wrong please try again later"
        );
      })
      .finally(() => {
        setLoading(false);
      });

    if (!newSchoolHour) {
      if (error === "") setError("Something went wrong please try again later");
      return;
    }
  };

  if (!active) return <></>;

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <Modal
        active={active}
        title={"Edit School Hour"}
        onActiveChange={(isActive) => {
          onActiveChange?.(isActive);
        }}
      >
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Start time:</span>
          </label>
          <input
            type="time"
            className="input input-bordered w-full"
            ref={time}
          />
        </div>

        <button
          className={
            loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
          }
          onClick={updateSchoolHour}
        >
          Update Class Hour
        </button>
      </Modal>
    </>
  );
}
