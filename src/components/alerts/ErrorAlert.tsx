import React, { useEffect } from "react";

type ErrorAlertProps = {
  msg: string;
  onVisibilityChange?: (msg: string) => void;
};

export default function ErrorAlert({
  msg,
  onVisibilityChange,
}: ErrorAlertProps) {
  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  useEffect(() => {
    timeout(10000).then(() => {
      onVisibilityChange?.("");
    });
  }, [msg, onVisibilityChange]);

  if (msg === "") return <></>;

  return (
    <>
      <div
        className={
          msg.length > 0
            ? "toast cursor-pointer z-50"
            : "toast invisible cursor-pointer z-50"
        }
        id="error"
      >
        <div className="alert alert-error shadow-lg">
          <div
            onClick={(event) => {
              onVisibilityChange?.("");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{msg}</span>
          </div>
        </div>
      </div>
    </>
  );
}
