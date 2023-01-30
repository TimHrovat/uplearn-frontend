import React, { useEffect, useRef, useState } from "react";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { EmployeesApi } from "../../../api/employees/employees-api";
import Loader from "../../../components/Loader";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import makeAnimated from "react-select/animated";

let options: { value: string; label: string }[] = [];
const animatedComponents = makeAnimated();

export default function ManageSubjectsCreate() {
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const handleSelectedEmployeeChange = (selected: any) => {
    setSelectedEmployees(selected);
  };

  const { status, data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: EmployeesApi.getAll,
  });

  if (status === "loading") return <Loader active={true} />;
  if (status === "error") return <ErrorAlert msg={"Page couldn't load"} />;

  options = [];

  employees?.data.forEach((employee: { id: string; user: any }) => {
    options.push({
      value: employee.id,
      label: `${employee.user.name} ${employee.user.surname}`,
    });
  });

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <SubpageBtnList
          buttons={[
            { title: "View subjects", link: "/dashboard/manage-subjects" },
            {
              title: "Create subject",
              link: "/dashboard/manage-subjects/create",
            },
            {
              title: "Create subject list",
              link: "/dashboard/manage-subjects/create-list",
            },
          ]}
        />
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">Create subject</h1>
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
            />
          </div>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Gsm:</span>
            </label>
            <input type="text" className="input input-bordered w-full " />
          </div>
        </div>
      </div>
    </>
  );
}
