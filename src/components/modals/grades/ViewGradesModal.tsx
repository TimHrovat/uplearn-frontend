import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { GradesApi } from "../../../api/grades/grades-api";
import { GradeInterface } from "../../../pages/dashboard/employee/ManageGrades";
import ErrorAlert from "../../alerts/ErrorAlert";
import SuccessAlert from "../../alerts/SuccessAlert";
import Modal from "../Modal";
import ConfirmDeletePopup from "../popups/ConfirmDeletePopup";
import GradeEditModal from "./GradeEditModal";

export type ViewGradesModalProps = {
  active: boolean;
  studentId: string;
  subject: string;
  fullName: string;
  onActiveChange: (active: boolean) => void;
};

export default function ViewGradesModal({
  active,
  studentId,
  subject,
  fullName,
  onActiveChange,
}: ViewGradesModalProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDeletePopupActive, setConfirmDeletePopupActive] =
    useState(false);
  const [gradeEditModalActive, setGradeEditModalActive] = useState(false);

  const [selectedGrade, setSelectedGrade] = useState({
    id: "",
    currentValue: 0,
  });

  const {
    status,
    data: grades,
    refetch,
  } = useQuery({
    queryKey: ["studentSubjectGrades"],
    queryFn: () => GradesApi.getByStudentAndSubject(studentId, subject),
    enabled: active,
  });

  const toDateString = (isodate: string) => {
    const date = new Date(isodate);

    const dateStr: string = `${date.getDate()}. ${
      date.getMonth() + 1
    }. ${date.getFullYear()}`;

    return dateStr;
  };

  const deleteGrade = async (id: string) => {
    await GradesApi.delete(id)
      .then(() => {
        setSuccess("Grade has been deleted");
      })
      .catch((e) => {
        setError(e.response.data.message ?? e.message);
      })
      .finally(() => {
        setLoading(false);
      });

    refetch();
  };

  if (!active) return <></>;

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <SuccessAlert
        msg={success}
        onVisibilityChange={(msg) => setSuccess(msg)}
      />
      <ConfirmDeletePopup
        active={confirmDeletePopupActive}
        onActiveChange={(active) => setConfirmDeletePopupActive(active)}
        deleteFunction={() => deleteGrade(selectedGrade.id)}
        prompt={`Are you sure you want to delete this grade?`}
      />
      <Modal
        active={active}
        title={"Grades (" + subject + ") - " + fullName}
        onActiveChange={(isActive) => onActiveChange?.(isActive)}
      >
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <td></td>
                <th>Grade</th>
                <th>Type</th>
                <th>Description</th>
                <th>Date</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {grades?.data.map((grade: GradeInterface, index: number) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{grade.value === 0 ? "NPS" : grade.value}</td>
                  <td>{grade.type}</td>
                  <td>
                    <div>{grade.description}</div>
                  </td>
                  <td>{toDateString(grade.createdAt)}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-outline"
                      onClick={() => {
                        setSelectedGrade({
                          id: grade.id,
                          currentValue: grade.value,
                        });
                        setGradeEditModalActive(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-error"
                      onClick={() => {
                        setSelectedGrade({
                          id: grade.id,
                          currentValue: grade.value,
                        });
                        setConfirmDeletePopupActive(true);
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
      </Modal>
      {!gradeEditModalActive ? (
        <></>
      ) : (
        <GradeEditModal
          active={gradeEditModalActive}
          onActiveChange={(isActive) => {
            setGradeEditModalActive(isActive);
            refetch();
          }}
          currentGrade={selectedGrade.currentValue}
          gradeId={selectedGrade.id}
        />
      )}
    </>
  );
}
