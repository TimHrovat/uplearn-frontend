import React from "react";

type SuccessAlertProps = {
  msg: string;
  onVisibilityChange?: (msg: string) => void;
};

export default function SuccessAlert({
  msg,
  onVisibilityChange,
}: SuccessAlertProps) {
  if (msg === "") return <></>;

  return (
    <>
      <div className={msg.length > 0 ? "toast cursor-pointer z-50" : "toast invisible cursor-pointer z-50"} id="error">
        <div className="alert alert-success shadow-lg">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{msg}</span>
          </div>
        </div>
      </div>
    </>
  );
}
