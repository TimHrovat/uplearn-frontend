import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ClassroomApi } from "../../../api/classroom/classroom-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";
import ConfirmDeletePopup from "../../../components/modals/popups/ConfirmDeletePopup";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageClassrooms() {
  const [error, setError] = useState("");

  const [confirmDeletePopupActive, setConfirmDeletePopupActive] =
    useState(false);
  const [modalClassroomName, setModalClassroomName] = useState("");

  const {
    status: classroomsStatus,
    data: classrooms,
    refetch,
  } = useQuery({
    queryKey: ["classrooms"],
    queryFn: ClassroomApi.getAll,
  });

  if (classroomsStatus === "loading") return <Loader active={true} />;
  if (classroomsStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  const deleteClassroom = async (name: string) => {
    await ClassroomApi.delete(name);

    refetch();
  };

  return (
    <>
      <ConfirmDeletePopup
        active={confirmDeletePopupActive}
        onActiveChange={(active) => setConfirmDeletePopupActive(active)}
        deleteFunction={() => deleteClassroom(modalClassroomName)}
        prompt={
          "Are you sure you want to delete classroom " +
          modalClassroomName +
          "?"
        }
      />
      <div className="flex flex-col justify-center items-center">
        <SubpageBtnList
          buttons={[
            { title: "View Classrooms", link: "/dashboard/manage-classrooms" },
            {
              title: "Create Classroom",
              link: "/dashboard/manage-classrooms/create",
            },
          ]}
        />
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">View Classrooms</h1>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {classrooms?.data.map(
                  (c: ClassroomInterface, index: number) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{c.name}</td>
                      <td>{c.type}</td>
                      <td>
                        <button
                          className="btn btn-error"
                          onClick={() => {
                            setConfirmDeletePopupActive(true);
                            setModalClassroomName(c.name);
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

interface ClassroomInterface {
  name: string;
  type: string;
}
