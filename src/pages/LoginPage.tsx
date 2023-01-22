import React, { useEffect, useState } from "react";
import { AuthApi } from "../api/auth/auth-api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.SyntheticEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    await AuthApi.login({
      username: username,
      password: password,
    })
      .then((rsp) => {
        setLoading(false);
        return rsp.json();
      })
      .then((data) => {
        if (data.statusCode || data.cause) {
          setError("Wrong username or password");
          return;
        }

        if (AuthApi.isAuthenticatedStrict()) {
          navigate("/dashboard");
        } else if (AuthApi.isAuthenticated())
          navigate("/auth/replace-first-password");
      });
  }

  function handleUsernameChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    setUsername(target.value);
  }

  function handlePasswordChange(e: React.SyntheticEvent) {
    const target = e.target as HTMLInputElement;

    setPassword(target.value);
  }

  useEffect(() => {
    if (AuthApi.isAuthenticatedStrict()) {
      navigate("/dashboard");
    } else if (AuthApi.isAuthenticated())
      navigate("/auth/replace-first-password");
  });

  return (
    <>
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="prose text-center mx-10  w-full max-w-md">
          <h1 className="text-5xl font-bold">UpLearn</h1>
          <div className="flex flex-col items-center p-7 bg-base-300 rounded-xl w-full">
            <input
              type="text"
              name="username"
              placeholder="username"
              className="input input-bordered w-full mb-5"
              onChange={handleUsernameChange}
              value={username}
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              className="input input-bordered w-full mb-5"
              onChange={handlePasswordChange}
              value={password}
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
              onClick={login}
            >
              LogIn
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
