import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { AuthApi } from "../../../api/auth/auth-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import Select from "react-select";
import { style } from "../../../components/ReactSelectStyle";
import makeAnimated from "react-select/animated";
import PageOutline from "../../../components/pages/PageOutline";

const animatedComponents = makeAnimated();

const avalibleRoles = [
  { value: "admin", label: "Admin" },
  { value: "employee", label: "Employee" },
  { value: "student", label: "Student" },
];

export default function ManageUsersCreate() {
  const [birthdate, setBirthdate] = useState(new Date());
  const name = useRef<HTMLInputElement>(null);
  const surname = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [gsm, setGsm] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBirthdateChange = (date: Date) => {
    if (date !== null) setBirthdate(date);
  };

  const handleRoleChange = (selected: any) => {
    setRole(selected.value);
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

    if (!isValidGsm(gsm)) {
      setError("Gsm is invalid");
      return;
    }

    const UserData = {
      name: name.current === null ? "" : name.current.value.trim(),
      surname: surname.current === null ? "" : surname.current.value.trim(),
      email: email.trim(),
      gsm:  gsm.trim(),
      dateOfBirth: birthdate.toISOString(),
      role: role,
    };

    setLoading(true);

    await AuthApi.register(UserData)
      .catch((e) => {
        setError(
          e.response.data.message ??
            "Something went wrong please try again later"
        );
      })
      .then((rsp) => {
        if (rsp) setSuccess("New user has been created");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function isValidEmail(email: string) {
    return /^\S+@\S+\.\S+/.test(email);
  }

  function isValidGsm(gsm: string) {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
      gsm
    );
  }

  const handleEmailBlur = () => {
    if (!isValidEmail(email) && email !== "") {
      setError("Email is invalid");
    } else {
      setError("");
    }
  };

  const handleGsmBlur = () => {
    if (!isValidGsm(gsm) && gsm !== "") {
      setError("Gsm is invalid (correct format: +38640505268)");
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
      <PageOutline
        title="Create User"
        navigationElements={[
          { title: "View users", link: "/dashboard/manage-users" },
          { title: "Create user", link: "/dashboard/manage-users/create" },
        ]}
      >
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
            value={gsm}
            onChange={(e) => setGsm(e.currentTarget.value)}
            onBlur={handleGsmBlur}
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Birthdate:</span>
          </label>
          <DatePicker
            selected={birthdate}
            onChange={handleBirthdateChange}
            dateFormat="dd. MM. yyyy"
            maxDate={new Date()}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control w-full mb-5">
          <label className="label">
            <span className="label-text">Role:</span>
          </label>
          <Select
            options={avalibleRoles}
            closeMenuOnSelect={true}
            components={animatedComponents}
            onChange={handleRoleChange}
            defaultValue={{ value: "student", label: "Student" }}
            styles={style}
          />
        </div>
        <button
          className={
            loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
          }
          onClick={createUser}
        >
          Create user
        </button>
      </PageOutline>
    </>
  );
}
