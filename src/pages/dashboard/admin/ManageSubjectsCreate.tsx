import React, { useRef, useState } from "react";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { EmployeesApi } from "../../../api/employees/employees-api";
import Loader from "../../../components/Loader";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import makeAnimated from "react-select/animated";
import { SubjectsApi } from "../../../api/subjects/subjects-api";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import { style } from "../../../components/ReactSelectStyle";

let options: { value: string; label: string }[] = [];
const animatedComponents = makeAnimated();

export default function ManageSubjectsCreate() {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const abbreviation = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLTextAreaElement>(null);

  const handleSelectedEmployeeChange = (selected: any) => {
    setSelectedEmployees(selected);
  };

  const { status, data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: EmployeesApi.getAll,
  });

  if (status === "loading") return <Loader active={true} />;
  if (status === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  options = [];

  employees?.data.forEach((employee: { id: string; user: any }) => {
    options.push({
      value: employee.id,
      label: `${employee.user.name} ${employee.user.surname}`,
    });
  });

  const createSubject = async () => {
    setError("");
    setSuccess("");

    if (name.current && name.current.value === "") {
      setError("You need to povide a full name for the subject");
      return;
    }

    if (abbreviation.current && abbreviation.current.value === "") {
      setError("You need to povide an abbreviation for the subject");
      return;
    }

    const data = {
      abbreviation:
        abbreviation.current === null ? "" : abbreviation.current.value,
      name: name.current === null ? "" : name.current.value,
      description:
        description.current === null ? "" : description.current.value,
      teachers: selectedEmployees,
    };

    setLoading(true);

    const subject = await SubjectsApi.createFromObject(data)
      .catch((e) => {
        setError(e.response.data.cause);
      })
      .finally(() => {
        setLoading(false);
      });

    if (!subject) {
      if (error === "") setError("Something went wrong please try again later");
      return;
    }

    setSuccess("New subject has been created");
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
            { title: "View subjects", link: "/dashboard/manage-subjects" },
            {
              title: "Create subject",
              link: "/dashboard/manage-subjects/create",
            },
            {
              title: "View subject lists",
              link: "/dashboard/manage-subjects/lists",
            },
            {
              title: "Create subject list",
              link: "/dashboard/manage-subjects/create-list",
            },
          ]}
        />
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">Create Subject</h1>

          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Abbreviation:</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              ref={abbreviation}
            />
          </div>
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
              <span className="label-text">Description:</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 w-full"
              ref={description}
            ></textarea>
          </div>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Teachers:</span>
            </label>
            <Select
              options={options}
              isMulti
              closeMenuOnSelect={false}
              components={animatedComponents}
              onChange={handleSelectedEmployeeChange}
              styles={style}
            />
          </div>
          <button
            className={
              loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
            }
            onClick={createSubject}
          >
            Create subject
          </button>
        </div>
      </div>
    </>
  );
}
