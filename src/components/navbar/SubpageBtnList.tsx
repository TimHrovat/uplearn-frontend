import React from "react";
import { Link } from "react-router-dom";

export interface SubpageBtnListProps {
  buttons: Button[];
}

export interface Button {
  title: string;
  link: string;
}

export default function SubpageBtnList({ buttons }: SubpageBtnListProps) {
  return (
    <>
      <div className="flex flex-row mb-10 btn-group">
        {buttons.map(({ title, link }, i) => {
          return (
            <Link
              to={link}
              key={i}
              className={
                window.location.pathname === link ? "btn btn-active" : "btn"
              }
            >
              {title}
            </Link>
          );
        })}
      </div>
    </>
  );
}
