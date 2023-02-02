import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { AuthApi } from "../../../api/auth/auth-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageUsersCreate() {
  const [birthdate, setBirthdate] = useState(new Date());
  const name = useRef<HTMLInputElement>(null);
  const surname = useRef<HTMLInputElement>(null);
  const gsm = useRef<HTMLInputElement>(null);
  const role = useRef<HTMLSelectElement>(null);
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBirthdateChange = (date: Date) => {
    if (date !== null) setBirthdate(date);
  };

  const createUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (name.current && name.current.value === "") {
      setError("You need to povide a name for the user");
      return;
    }

    if (surname.current && surname.current.value === "") {
      setError("You need to povide a surname for the user");
      return;
    }

    if (email === "") {
      setError("You need to povide an email for the user");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    setLoading(true);

    const UserData = {
      name: name.current === null ? "" : name.current.value,
      surname: surname.current === null ? "" : surname.current.value,
      email: email,
      gsm: gsm.current === null ? "" : gsm.current.value,
      dateOfBirth: birthdate.toISOString(),
      role: role.current === null ? "" : role.current.value,
    };

    const updated = await AuthApi.register(UserData)
      .then((rsp) => {
        return rsp.json();
      })
      .finally(() => {
        setLoading(false);
      });

    if (!updated || updated.statusCode || updated.cause) {
      setError("Something went wrong please try again later");
      return;
    }

    setSuccess("New user has been created");
  };

  function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleEmailBlur = () => {
    if (!isValidEmail(email) && email !== "") {
      setError("Email is invalid");
    } else {
      setError("");
    }
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
            { title: "View users", link: "/dashboard/manage-users" },
            { title: "Create user", link: "/dashboard/manage-users/create" },
          ]}
        />
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">Create user</h1>
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
              <span className="label-text">Surname:</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full "
              ref={surname}
            />
          </div>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Email:</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full "
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              onBlur={handleEmailBlur}
            />
          </div>
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Gsm*:</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full "
              ref={gsm}
            />
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
          <div className="form-control w-full mb-5">
            <label className="label">
              <span className="label-text">Role:</span>
            </label>
            <select
              className="select select-bordered w-full"
              defaultValue="student"
              ref={role}
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <button
            className={
              loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
            }
            onClick={createUser}
          >
            Create user
          </button>
        </div>
      </div>
    </>
  );
}
