import React, { useState } from "react";
import ErrorAlert from "../../alerts/ErrorAlert";

export type ConfirmDeletePopupProps = {
  active: boolean;
  onActiveChange: (active: boolean) => void;
  deleteFunction: () => any;
  prompt: string;
};

export default function ConfirmDeletePopup({
  active,
  onActiveChange,
  deleteFunction,
  prompt,
}: ConfirmDeletePopupProps) {
  const [error, setError] = useState("");

  if (!active) return <></>;

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />

      <div className="fixed w-full h-full inset-0 bg-[rgba(0,0,0,0.4)] z-50 flex content-center justify-center">
        <div className="flex h-fit my-auto content-center justify-center">
          <div className="bg-base-200 p-4 rounded-xl mx-3">
            <div className="w-full whitespace-normal break-words">
              <h1 className="text-xl font-bold mb-5 flex-1 pt-2">{prompt}</h1>
            </div>
            <div className="mt-10">
              <div className="flex w-full justify-end">
                <button
                  className="btn btn-outline mr-5"
                  onClick={() => {
                    onActiveChange?.(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error "
                  onClick={() => {
                    deleteFunction();
                    onActiveChange?.(false);
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
