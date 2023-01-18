import React from "react";
import Navbar from "./Navbar";

export type DashboardRouteProps = {
  element: JSX.Element;
};

export default function DashboardRoute({ element }: DashboardRouteProps) {
  return (
    <>
      <Navbar content={element} />
    </>
  );
}
