import { faPeopleGroup, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { SubjectsApi } from "../../../api/subjects/subjects-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";
import ConfirmDeletePopup from "../../../components/modals/popups/ConfirmDeletePopup";
import SubjectEditModal from "../../../components/modals/SubjectEditModal";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageSubjects() {
  const [confirmDeletePopupActive, setConfirmDeletePopupActive] =
    useState(false);
  const [subjectEditModalActive, setSubjectEditModalActive] = useState(false);
  const [subjectAbbreviation, setSubjectAbbreviation] = useState("");
  const [error, setError] = useState("");

  const {
    status: subjectsStatus,
    data: subjects,
    refetch,
  } = useQuery({
    queryKey: ["classrooms"],
    queryFn: SubjectsApi.getAll,
  });

  if (subjectsStatus === "loading") return <Loader active={true} />;
  if (subjectsStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  const deleteSubject = async (abbr: string) => {
    await SubjectsApi.delete(abbr);

    refetch();
  };

  return (
    <>
      <ConfirmDeletePopup
        active={confirmDeletePopupActive}
        onActiveChange={(active) => setConfirmDeletePopupActive(active)}
        deleteFunction={() => deleteSubject(subjectAbbreviation)}
        prompt={
          "Are you sure you want to delete subject " + subjectAbbreviation + "?"
        }
      />
      {subjectEditModalActive ? (
        <SubjectEditModal
          active={subjectEditModalActive}
          modalSubjectAbbreviation={subjectAbbreviation}
          onActiveChange={(active) => setSubjectEditModalActive(active)}
        />
      ) : (
        <></>
      )}
      <div className="flex flex-col justify-center items-center">
        <SubpageBtnList
          buttons={[
            { title: "View subjects", link: "/dashboard/manage-subjects" },
            {
              title: "Create subject",
              link: "/dashboard/manage-subjects/create",
            },
            {
              title: "View subject lists",
              link: "/dashboard/manage-subjects/lists",
            },
            {
              title: "Create subject list",
              link: "/dashboard/manage-subjects/create-list",
            },
          ]}
        />
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">View Subjects</h1>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Abbreviation</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Assign Teachers</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {subjects?.data.map((s: SubjectInterface, index: number) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{s.abbreviation}</td>
                    <td>{s.name}</td>
                    <td>{s.description ? s.description : "/"}</td>
                    <td>
                      <button
                        className="btn btn-info btn-outline"
                        onClick={() => {
                          setSubjectEditModalActive(true);
                          setSubjectAbbreviation(s.abbreviation);
                        }}
                      >
                        <FontAwesomeIcon icon={faPeopleGroup} size="lg" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-error"
                        onClick={() => {
                          setConfirmDeletePopupActive(true);
                          setSubjectAbbreviation(s.abbreviation);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} size="lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

interface SubjectInterface {
  abbreviation: string;
  name: string;
  description: string;
}
