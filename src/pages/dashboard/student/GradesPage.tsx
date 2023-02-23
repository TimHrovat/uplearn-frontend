import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Grades from "../../../components/Grades";
import Loader from "../../../components/Loader";

export default function GradesPage() {
  const [error, setError] = useState("");

  const { status, data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  if (status === "loading") return <Loader active={true} />;
  if (status === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
  );

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
        <h1 className="text-xl font-bold mb-5">Grades</h1>
        <Grades studentId={authUser?.data.Student?.id} />
      </div>
    </div>
  );
}
