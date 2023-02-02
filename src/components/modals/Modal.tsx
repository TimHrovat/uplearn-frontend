import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export type ModalProps = {
  children: string | JSX.Element | JSX.Element[];
  active: boolean;
  title?: string;
  onActiveChange: (active: boolean) => void;
};

export default function Modal({
  children,
  active,
  title,
  onActiveChange,
}: ModalProps) {
  if (!active) return <></>;

  return (
    <div className="fixed w-full h-full inset-0  backdrop-brightness-50 z-20">
      <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-base-200 p-4 rounded-xl desktop:w-1/2 w-full mx-3">
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
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
