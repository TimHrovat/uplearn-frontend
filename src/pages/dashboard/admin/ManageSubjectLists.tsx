import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { SubjectListsApi } from "../../../api/subjects/subject-listst-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";
import ConfirmDeletePopup from "../../../components/modals/popups/ConfirmDeletePopup";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageSubjectLists() {
  const [subjectList, setSubjectList] = useState({ id: "", name: "" });
  const [confirmDeletePopupActive, setConfirmDeletePopupActive] =
    useState(false);
  const [error, setError] = useState("");

  const {
    status: subjectListsStatus,
    data: subjectLists,
    refetch,
  } = useQuery({
    queryKey: ["subjectLists"],
    queryFn: SubjectListsApi.getAll,
  });

  if (subjectListsStatus === "loading") return <Loader active={true} />;
  if (subjectListsStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  const deleteSubjectList = async (id: string) => {
    setError("");

    await SubjectListsApi.delete(id).catch((e) => {
      setError(e.response.data.message ?? e.message);
    });

    refetch();
  };

  return (
    <>
      <ConfirmDeletePopup
        active={confirmDeletePopupActive}
        onActiveChange={(active) => setConfirmDeletePopupActive(active)}
        deleteFunction={() => deleteSubjectList(subjectList.id)}
        prompt={
          "Are you sure you want to delete subject list " +
          subjectList.name +
          "?"
        }
      />
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
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
          <h1 className="text-xl font-bold mb-5">View Subject Lists</h1>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Subjects</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {subjectLists?.data.map(
                  (subjectList: SubjectListInterface, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{subjectList.name}</td>
                      <td className="max-w-[15rem]">
                        <div className="flex flex-row flex-wrap">
                          {subjectList.Subject_SubjectList.map(
                            (s: { subjectAbbreviation: string }) => (
                              <span
                                key={s.subjectAbbreviation}
                                className="badge mb-2 mr-2 text-base"
                              >
                                {s.subjectAbbreviation}
                              </span>
                            )
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-error"
                          onClick={() => {
                            setConfirmDeletePopupActive(true);
                            setSubjectList({
                              id: subjectList.id,
                              name: subjectList.name,
                            });
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashCan} size="lg" />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

interface SubjectListInterface {
  name: string;
  id: string;
  Subject_SubjectList: [
    {
      subjectAbbreviation: string;
    }
  ];
}
