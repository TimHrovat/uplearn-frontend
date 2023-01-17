import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../api/auth/auth-api";

export default function ReplaceFirstPasswordPage() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function replaceFirstPassword() {
    setLoading(true);
    if (firstPassword === "" || secondPassword === "") return;

    if (firstPassword !== secondPassword) return;

    if (firstPassword.length < 8) return;

    const resp = await AuthApi.replaceFirstPassword(firstPassword);

    setLoading(false);

    if (resp.statusCode || resp === undefined) return;

    navigate("/dashboard");
  }

  function handleFirstPasswordChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    setFirstPassword(target.value);
  }

  function handleSecondPasswordChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    setSecondPassword(target.value);
  }

  useEffect(() => {
    setError("");

    if (firstPassword === "" || secondPassword === "") return;

    if (firstPassword !== secondPassword) {
      setError("Passwords must match");
      return;
    }

    if (firstPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
  }, [firstPassword, secondPassword]);

  useEffect(() => {
    if (AuthApi.isAuthenticatedStrict()) {
      navigate("/dashboard");
      return;
    }

    if (!AuthApi.isAuthenticated()) navigate("/login");
  });

  return (
    <>
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="prose text-center mx-10  w-full max-w-md">
          <h1 className="text-5xl font-bold">Set your new password</h1>
          <div className="flex flex-col items-center p-7 bg-base-300 rounded-xl w-full">
            <input
              type="password"
              placeholder="password"
              className="input input-bordered w-full mb-5"
              onChange={handleFirstPasswordChange}
              value={firstPassword}
            />
            <input
              type="password"
              placeholder="confirm password"
              className="input input-bordered w-full mb-5"
              onChange={handleSecondPasswordChange}
              value={secondPassword}
            />
            {error !== "" ? (
              <p className="text-error mt-0 mb-5">{error}</p>
            ) : null}
            <button
              className={
                loading
                  ? "btn btn-primary loading w-8/12"
                  : "btn btn-primary w-8/12"
              }
              onClick={replaceFirstPassword}
            >
              LogIn
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
