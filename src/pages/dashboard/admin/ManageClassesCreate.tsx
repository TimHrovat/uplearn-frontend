import React, { useEffect, useRef, useState } from "react";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageClassesCreate() {
  const avalibleSubjectLists = useState([]);

  const name = useRef<HTMLInputElement>(null);
  const year = useRef<HTMLInputElement>(null);
  const subjectList = useRef<HTMLSelectElement>(null);

  useEffect(()=> {

  })

  return (
    <div className="flex flex-col justify-center items-center">
      <SubpageBtnList
        buttons={[
          { title: "View classes", link: "/dashboard/manage-classes" },
          { title: "Create class", link: "/dashboard/manage-classes/create" },
        ]}
      />
      <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
        <h1 className="text-xl font-bold mb-5">Create class</h1>
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
            <span className="label-text">Year:</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            ref={year}
          />
        </div>
        <div className="form-control w-full mb-5">
            {/* TODO: add avalible subject lists  */}
          <label className="label">
            <span className="label-text">Subject list:</span>
          </label>
          <select
            className="select select-bordered w-full"
            defaultValue="student"
            ref={subjectList}
          >
            <option value="admin">Admin</option>
            <option value="student">Student</option>
            <option value="employee">Employee</option>
          </select>
        </div>
      </div>
    </div>
  );
}
