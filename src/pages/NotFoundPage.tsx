import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function NotFoundPage() {
  return (
    <>
      <div className="hero min-h-screen bg-base-100">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-12">Page Not Found</h1>
            <Link to={"/"}>
              <button className="btn btn-primary">Go Home</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
