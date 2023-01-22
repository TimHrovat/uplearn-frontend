import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function ManageUsers() {
  const [birthdate, setBirthdate] = useState(new Date());

  const handleBirthdateChange = (date: Date) => {
    if (date !== null) setBirthdate(date);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">Create user</h1>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Name:</span>
            </label>
            <input type="text" className="input input-bordered w-full " />
          </div>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Surname:</span>
            </label>
            <input type="text" className="input input-bordered w-full " />
          </div>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Email:</span>
            </label>
            <input type="text" className="input input-bordered w-full " />
          </div>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Birthdate:</span>
            </label>
            <DatePicker
              selected={birthdate}
              onChange={handleBirthdateChange}
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              className="input input-bordered w-full"
            />
          </div>
          <button className="btn btn-primary">Create user</button>
        </div>
      </div>
    </>
  );
}
