import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi } from "../api/auth/auth-api";
import Footer from "../components/Footer";

export default function ResetPasswordPromptPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (AuthApi.isAuthenticatedStrict()) {
      navigate("/dashboard");
    } else if (AuthApi.isAuthenticated())
      navigate("/auth/replace-first-password");
  });

  async function sendResetPasswordEmail(e: React.SyntheticEvent) {
    e.preventDefault();

    setError("");

    if (username === "") {
      setError("Please enter an username");
      return;
    }

    setLoading(true);

    AuthApi.sendForgotPasswordEmail(username)
      .catch((e) => setError(e.response.data.message ?? e.message))
      .then((res) => {
        if (res) navigate("/login");
      })
      .finally(() => setLoading(false));
  }

  function handleUsernameChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    setUsername(target.value);
  }

  return (
    <>
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="prose text-center mx-10  w-full max-w-md">
          <h1 className="text-5xl font-bold">Reset Password</h1>
          <div className="flex flex-col p-7 bg-base-300 rounded-xl w-full">
            <input
              type="text"
              name="username"
              placeholder="username"
              className="input input-bordered w-full mb-5"
              onChange={handleUsernameChange}
              value={username}
            />
            {error !== "" ? (
              <p className="text-error mt-0 mb-5">{error}</p>
            ) : null}
            <div className="text-center">
              <button
                className={
                  loading
                    ? "btn btn-primary loading w-1/2"
                    : "btn btn-primary w-1/2"
                }
                onClick={sendResetPasswordEmail}
              >
                Get Email
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
