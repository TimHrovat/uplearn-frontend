import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function HeroPage() {
  return (
    <>
      <div className="hero min-h-screen bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">UpLearn</h1>
            <p className="py-6">
              UpLearn is a school organization software developed as a
              graduation project at Vegova, Ljubljana.
            </p>
            <Link to={"/login"}>
              <button className="btn btn-primary">Get Started</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
