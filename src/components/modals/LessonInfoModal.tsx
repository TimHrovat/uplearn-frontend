import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { AuthApi } from "../../api/auth/auth-api";
import { LessonsApi } from "../../api/lessons/lessons-api";
import { UsersApi } from "../../api/users/users-api";
import ErrorAlert from "../alerts/ErrorAlert";
import Loader from "../Loader";
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import Modal from "./Modal";

export type LessonInfoModalProps = {
  active: boolean;
  lessonId: string;
  onActiveChange: (active: boolean) => void;
};

export default function LessonInfoModal({
  active,
  onActiveChange,
  lessonId,
}: LessonInfoModalProps) {
  const [error, setError] = useState("");
  const [confirmDeletePopupActive, setConfirmDeletePopupActive] =
    useState(false);
  const [confirmDeleteManyPopupActive, setConfirmDeleteManyPopupActive] =
    useState(false);

  const {status: authUserStatus, data: authUser} = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
    enabled: active,
  })

  const { status, data: lesson } = useQuery({
    queryKey: ["lesson"],
    queryFn: () => LessonsApi.getUnique(lessonId),
    enabled: active
  });

  if (status === "loading" || authUserStatus === "loading") return <Loader active={true} />;
  if (status === "error" || authUserStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  if (!active) return <></>;

  const deleteLesson = async () => {
    await LessonsApi.delete(lessonId);

    onActiveChange(false);
  };

  const deleteMany = async () => {
    await LessonsApi.deleteMany(lesson?.data.lessonGroup);

    onActiveChange(false);
  };

  return (
    <>
      <ConfirmDeletePopup
        active={confirmDeletePopupActive}
        onActiveChange={(active) => setConfirmDeletePopupActive(active)}
        deleteFunction={() => deleteLesson()}
        prompt={"Are you sure you want to delete this lesson?"}
      />
      <ConfirmDeletePopup
        active={confirmDeleteManyPopupActive}
        onActiveChange={(active) => setConfirmDeleteManyPopupActive(active)}
        deleteFunction={() => deleteMany()}
        prompt={
          "Are you sure you want to delete this lesson and it's other occurences?"
        }
      />
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <Modal
        active={active}
        title={
          lesson?.data.subjectAbbreviation === null
            ? "Lesson - Substitute"
            : "Lesson - " + lesson?.data.subjectAbbreviation
        }
        onActiveChange={(isActive) => onActiveChange?.(isActive)}
      >
        <div className="overflow-x-auto">
          <table className="table w-full">
            <tbody>
              <tr>
                <th className="w-1/3">Subject Abbreviation: </th>
                <td className="w-2/3">
                  {lesson?.data.subjectAbbreviation === null
                    ? "Substitute"
                    : lesson?.data.subjectAbbreviation}
                </td>
              </tr>
              <tr>
                <th className="w-1/3">Full Subject Name: </th>
                <td className="w-2/3">
                  {lesson?.data.employee_Subject?.subject.name ?? "Substitute"}
                </td>
              </tr>
              <tr>
                <th className="w-1/3">Type: </th>
                <td className="w-2/3">{lesson?.data.type.toLowerCase()}</td>
              </tr>
              <tr>
                <th className="w-1/3">Teacher: </th>
                <td className="w-2/3">
                  {lesson?.data.employee_Subject?.employee.user.name ===
                  undefined
                    ? `${lesson?.data.substituteEmployee.user.name} ${lesson?.data.substituteEmployee.user.surname}`
                    : `${lesson?.data.employee_Subject?.employee.user.name} ${lesson?.data.employee_Subject?.employee.user.surname}`}
                </td>
              </tr>
              <tr>
                <th className="w-1/3">Classroom: </th>
                <td className="w-2/3">{lesson?.data.classroomName}</td>
              </tr>
              <tr>
                <th className="w-1/3">Description: </th>
                <td className="w-2/3">{lesson?.data.description}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {AuthApi.isStudent() || authUser?.data.Employee.id !== lesson?.data.employeeId ? (
          <></>
        ) : (
          <button
            className="btn btn-outline btn-error mt-5 mr-5"
            onClick={() => setConfirmDeletePopupActive(true)}
          >
            Delete Lesson
          </button>
        )}
        {lesson?.data.lessonGroup === null || AuthApi.isStudent() || authUser?.data.Employee.id !== lesson?.data.employeeId ? (
          <></>
        ) : (
          <button
            className="btn btn-outline btn-error mt-5"
            onClick={() => setConfirmDeleteManyPopupActive(true)}
          >
            Delete All Occurences
          </button>
        )}
      </Modal>
    </>
  );
}
