import React, { useState } from "react";
import { ExcelApi } from "../../../api/excel/excel-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import PageOutline from "../../../components/pages/PageOutline";

export default function ExcelUserImport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [file, setFile] = useState<File>();

  const handleChange = (event: any) => {
    setFile(event.target.files[0]);
  };

  const importUsers = () => {
    setLoading(true);
    ExcelApi.importUsers(file)
      .catch((e) => {
        setError(e.response.data.message ?? e.message);
      })
      .then((res) => {
        if (res) setSuccess("Users added successfully");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <SuccessAlert
        msg={success}
        onVisibilityChange={(msg) => setSuccess(msg)}
      />
      <PageOutline
        title="Excel Import"
        navigationElements={[
          { title: "View users", link: "/dashboard/manage-users" },
          { title: "Create user", link: "/dashboard/manage-users/create" },
          {
            title: "Excel Import",
            link: "/dashboard/manage-users/excel-import",
          },
        ]}
      >
        <input
          type="file"
          accept=".xlsx"
          className="file-input w-full max-w-xs my-5"
          onChange={handleChange}
        />
        <br />
        <button
          className={
            loading ? "btn btn-primary loading mt-5" : "btn btn-primary mt-5"
          }
          onClick={importUsers}
        >
          Import Csv
        </button>
        <a
          className="ml-5 link"
          href={process.env.REACT_APP_API_URL + "/excel/template"}
        >
          Download template
        </a>
      </PageOutline>
    </>
  );
}
