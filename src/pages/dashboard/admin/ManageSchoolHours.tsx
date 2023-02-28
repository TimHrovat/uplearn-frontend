import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { SchoolHoursApi } from "../../../api/school-hours/school-hours-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import Loader from "../../../components/Loader";
import ConfirmDeletePopup from "../../../components/modals/popups/ConfirmDeletePopup";
import SchoolHourEditModal from "../../../components/modals/SchoolHourEditModal";
import PageOutline from "../../../components/pages/PageOutline";

export default function ManageSchoolHours() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [confirmDeletePopupActive, setConfirmDeletePopupActive] =
    useState(false);
  const [modalSchoolHourId, setModalSchoolHourId] = useState("");
  const [schoolHourEditModalActive, setSchoolHourEditModalActive] =
    useState(false);

  const {
    status: schoolHoursStatus,
    data: schoolHours,
    refetch,
  } = useQuery({
    queryKey: ["classrooms"],
    queryFn: SchoolHoursApi.getAll,
  });

  if (schoolHoursStatus === "loading") return <Loader active={true} />;
  if (schoolHoursStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  const deleteSchoolHour = async (id: string) => {
    await SchoolHoursApi.delete(id);

    refetch();
  };

  return (
    <>
      <ConfirmDeletePopup
        active={confirmDeletePopupActive}
        onActiveChange={(active) => setConfirmDeletePopupActive(active)}
        deleteFunction={() => deleteSchoolHour(modalSchoolHourId)}
        prompt={
          "Are you sure you want to delete this school hour? All lessons tied to this school hour will be deleted as well."
        }
      />
      <SchoolHourEditModal
        active={schoolHourEditModalActive}
        modalSchoolHourId={modalSchoolHourId}
        onActiveChange={(active) => {
          setSchoolHourEditModalActive(active);
          refetch();
        }}
      />
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <SuccessAlert
        msg={success}
        onVisibilityChange={(msg) => setSuccess(msg)}
      />
      <PageOutline
        title="View School Hours"
        navigationElements={[
          {
            title: "View school hours",
            link: "/dashboard/manage-school-hours",
          },
          {
            title: "Create school hour",
            link: "/dashboard/manage-school-hours/create",
          },
        ]}
      >
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th></th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {schoolHours?.data.map(
                (c: SchoolHourInterface, index: number) => (
                  <tr key={c.id}>
                    <td>{index + 1}</td>
                    <td>{toFormattedDate(c.startTime)}</td>
                    <td>{toFormattedDate(c.endTime)}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-outline"
                        onClick={() => {
                          setSchoolHourEditModalActive(true);
                          setModalSchoolHourId(c.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-error"
                        onClick={() => {
                          setConfirmDeletePopupActive(true);
                          setModalSchoolHourId(c.id);
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
      </PageOutline>
    </>
  );
}

export function toFormattedDate(isoDate: string) {
  const date = new Date(isoDate);

  let minutes = Number(date.getMinutes());
  let hours = Number(date.getHours());

  const formattedHours = hours < 10 ? "0" + hours : hours;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return formattedHours + ":" + formattedMinutes;
}

export interface SchoolHourInterface {
  id: string;
  startTime: string;
  endTime: string;
}
