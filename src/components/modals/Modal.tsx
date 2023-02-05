import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export type ModalProps = {
  children: string | JSX.Element | JSX.Element[];
  active: boolean;
  title?: string;
  fullWidth?: boolean;

  onActiveChange: (active: boolean) => void;
};

export default function Modal({
  children,
  active,
  title,
  onActiveChange,
  fullWidth,
}: ModalProps) {
  if (!active) return <></>;

  return (
    <div className="fixed w-full h-full inset-0 backdrop-brightness-50 z-20 overflow-auto">
      <div
        className={
          fullWidth === false || fullWidth === undefined
            ? "absolute left-1/2 -translate-x-1/2 bg-base-200 p-4 rounded-xl my-14 w-11/12 desktop:w-1/2"
            : "absolute left-1/2 -translate-x-1/2 bg-base-200 p-4 rounded-xl my-14 w-11/12"
        }
      >
        <div className="w-full flex flex-row ">
          <h1 className="text-xl font-bold mb-5 flex-1 pt-2">{title}</h1>
          <div className="flex-1">
            <button
              className="btn btn-ghost float-right"
              onClick={() => onActiveChange?.(false)}
            >
              <FontAwesomeIcon icon={faXmark} size="2x" />
            </button>
          </div>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
