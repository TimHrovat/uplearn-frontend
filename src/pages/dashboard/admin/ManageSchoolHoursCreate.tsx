import React, { useRef, useState } from "react";
import {
  CreateSchoolHour,
  SchoolHoursApi,
} from "../../../api/school-hours/school-hours-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageSchoolHoursCreate() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const time = useRef<HTMLInputElement>(null);

  const createSchoolHour = async () => {
    setError("");
    setSuccess("");

    if (time.current?.value === "") {
      setError("Please provide a starting time for the school hour");
      return;
    }

    setLoading(true);

    const data: CreateSchoolHour = {
      startTime: time.current?.value + ":00",
    };

    const newSchoolHour = await SchoolHoursApi.create(data)
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

    setSuccess("New class hour created");
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
            {
              title: "View school hours",
              link: "/dashboard/manage-school-hours",
            },
            {
              title: "Create school hour",
              link: "/dashboard/manage-school-hours/create",
            },
          ]}
        />
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">Create Class Hour</h1>
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
            onClick={createSchoolHour}
          >
            Create Class Hour
          </button>
        </div>
      </div>
    </>
  );
}
