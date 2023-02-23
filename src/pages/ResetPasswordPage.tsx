import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../api/auth/auth-api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(window.location.search);

  const token = queryParams.get("token");

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  async function resetPassword() {
    if (firstPassword === "" || secondPassword === "") return;

    if (firstPassword !== secondPassword) return;

    if (firstPassword.length < 8) return;

    if (!token || token === "") {
      setError("No token provided");
      return;
    }

    setLoading(true);

    await AuthApi.resetPassword(token, firstPassword)
      .catch((e) => {
        setError(e.response.data.message ?? e.message);
      })
      .then(async (res) => {
        if (res) {
          setSuccess("Password reset successful");
          setLoading(false);
          await timeout(3000);
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
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
  }, [firstPassword, secondPassword, token]);

  useEffect(() => {
    if (AuthApi.isAuthenticatedStrict()) {
      navigate("/dashboard");
      return;
    }
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
            {success !== "" ? (
              <p className="text-accent mt-0 mb-5">{success}</p>
            ) : null}
            <button
              className={
                loading
                  ? "btn btn-primary loading w-8/12"
                  : "btn btn-primary w-8/12"
              }
              onClick={resetPassword}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
