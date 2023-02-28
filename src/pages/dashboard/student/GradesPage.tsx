import { useQuery } from "@tanstack/react-query";
import React from "react";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Grades from "../../../components/Grades";
import Loader from "../../../components/Loader";
import PageOutline from "../../../components/pages/PageOutline";

export default function GradesPage() {
  const { status, data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  if (status === "loading") return <Loader active={true} />;
  if (status === "error") return <ErrorAlert msg={"Page couldn't load"} />;

  return (
    <PageOutline title="Grades">
      <Grades studentId={authUser?.data.Student?.id} />
    </PageOutline>
  );
}
