import React from "react";
import SubpageBtnList, { Button } from "../navbar/SubpageBtnList";

interface PageOutlineProps {
  fullWidth?: boolean;
  children: string | JSX.Element | JSX.Element[];
  title: string;
  navigationElements: Button[];
}

PageOutline.defaultProps = {
  fullWidth: false,
  title: "",
  navigationElements: [],
};

export default function PageOutline({
  fullWidth,
  children,
  title,
  navigationElements,
}: PageOutlineProps) {
  return (
    <div className="flex flex-col justify-center items-center">
      {navigationElements?.length === 0 ? (
        <></>
      ) : (
        <SubpageBtnList buttons={navigationElements} />
      )}
      <div
        className={`bg-base-200 p-4 rounded-xl ${
          fullWidth ? "" : "desktop:w-2/3"
        } w-full max-w-screen-xl mb-5`}
      >
        <h1 className="text-xl font-bold mb-5">{title}</h1>
        {children}
      </div>
    </div>
  );
}
