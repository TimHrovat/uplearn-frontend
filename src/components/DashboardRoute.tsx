import React from "react";
import Footer from "./Footer";
import Navbar from "./navbar/Navbar";

export type DashboardRouteProps = {
  element: JSX.Element;
};

export default function DashboardRoute({ element }: DashboardRouteProps) {
  return (
    <>
      <Navbar content={element} />
      <Footer />
    </>
  );
}
