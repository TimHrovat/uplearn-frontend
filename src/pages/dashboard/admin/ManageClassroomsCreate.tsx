import React, { useRef, useState } from "react";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { ClassroomApi } from "../../../api/classroom/classroom-api";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import ErrorAlert from "../../../components/alerts/ErrorAlert";

const animatedComponents = makeAnimated();

let options: { value: string; label: string }[] = [
  { value: "NORMAL", label: "normal" },
  { value: "LAB", label: "lab" },
  { value: "GYM", label: "gym" },
  { value: "COMPUTER", label: "computer" },
];

export default function ManageClassroomsCreate() {
  const name = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedType, setSelectedType] = useState("");

  const handleSelectedTypeChange = (selected: any) => {
    setSelectedType(selected.value);
  };

  const createClassroom = async () => {
    setError("");
    setSuccess("");

    if (name.current && name.current.value === "") {
      setError("You need to povide a name for the classroom");
      return;
    }

    if (selectedType === "") {
      setError("You need to select a type for the classroom");
      return;
    }

    const data = {
      name: name.current === null ? "" : name.current.value,
      type: selectedType,
    };

    setLoading(true);

    const subjectList = await ClassroomApi.create(data)
      .catch((e) => {
        setError(
          e.response.data.cause ?? "Something went wrong please try again later"
        );
      })
      .finally(() => {
        setLoading(false);
      });

    if (!subjectList) {
      if (error === "") setError("Something went wrong please try again later");
      return;
    }

    setSuccess("New classroom has been created");
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
            { title: "View classrooms", link: "/dashboard/manage-classrooms" },
            {
              title: "Create classroom",
              link: "/dashboard/manage-classrooms/create",
            },
          ]}
        />
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">Create Classroom</h1>
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
              <span className="label-text">Subjects:</span>
            </label>
            <Select
              options={options}
              closeMenuOnSelect={true}
              components={animatedComponents}
              onChange={handleSelectedTypeChange}
              styles={{ option: (styles) => ({ ...styles, color: "black" }) }}
            />
          </div>
          <button
            className={
              loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
            }
            onClick={createClassroom}
          >
            Create Classroom
          </button>
        </div>
      </div>
    </>
  );
}
