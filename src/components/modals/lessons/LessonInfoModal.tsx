import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { AuthApi } from "../../../api/auth/auth-api";
import { LessonsApi } from "../../../api/lessons/lessons-api";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../alerts/ErrorAlert";
import Loader from "../../Loader";
import ConfirmDeletePopup from "../popups/ConfirmDeletePopup";
import Modal from "../Modal";
import { StudentInterface } from "../classes/ClassStudentsModal";
import { AbsencesApi } from "../../../api/absences/absences-api";

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

  const { status: authUserStatus, data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
    enabled: active,
  });

  const {
    status,
    data: lesson,
    refetch,
  } = useQuery({
    queryKey: ["lesson"],
    queryFn: () => LessonsApi.getUnique(lessonId),
    enabled: active,
  });

  if (status === "loading" && authUserStatus === "loading")
    return <Loader active={true} />;
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

  const createAbsence = async (studentId: string) => {
    await AbsencesApi.create({ lessonId: lesson?.data.id, studentId });

    refetch();
  };

  const deleteAbsence = async (absenceId: string) => {
    await AbsencesApi.delete(absenceId);

    refetch();
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
          <table className="table w-full !table-zebra">
            <thead className="hidden"></thead>
            <tbody>
              <tr>
                <th className="w-1/3 !bg-base-100">Subject Abbreviation: </th>
                <td className="w-2/3 !bg-base-100">
                  {lesson?.data.subjectAbbreviation === null
                    ? "Substitute"
                    : lesson?.data.subjectAbbreviation}
                </td>
              </tr>
              <tr>
                <th className="w-1/3 !bg-base-200">Full Subject Name: </th>
                <td className="w-2/3 !bg-base-200">
                  {lesson?.data.employee_Subject?.subject.name ?? "Substitute"}
                </td>
              </tr>
              <tr>
                <th className="w-1/3 !bg-base-100">Type: </th>
                <td className="w-2/3 !bg-base-100">{lesson?.data.type.toLowerCase()}</td>
              </tr>
              <tr>
                <th className="w-1/3 !bg-base-200">Teacher: </th>
                <td className="w-2/3 !bg-base-200">
                  {lesson?.data.employee_Subject?.employee.user.name ===
                  undefined
                    ? `${lesson?.data.substituteEmployee.user.name} ${lesson?.data.substituteEmployee.user.surname}`
                    : `${lesson?.data.employee_Subject?.employee.user.name} ${lesson?.data.employee_Subject?.employee.user.surname}`}
                </td>
              </tr>
              <tr>
                <th className="w-1/3 !bg-base-100">Classroom: </th>
                <td className="w-2/3 !bg-base-100">{lesson?.data.classroomName}</td>
              </tr>
              <tr>
                <th className="w-1/3 !bg-base-200">Description: </th>
                <td className="w-2/3 !bg-base-200 whitespace-normal break-words">
                  {lesson?.data.description}
                </td>
              </tr>
              {AuthApi.isStudent() ||
              (AuthApi.isEmployee() &&
                authUser?.data.Employee?.id !== lesson?.data.employeeId) ? (
                <tr className="hidden"></tr>
              ) : (
                <>
                  <tr>
                    <th className="w-1/3 !bg-base-100">Present: </th>
                    <td className="w-2/3 !bg-base-100">
                      <div className="flex flex-row flex-wrap gap-4">
                        {lesson?.data.class?.Student.map(
                          (student: StudentInterface, index: number) =>
                            student.Absence.length === 0 ? (
                              <div
                                key={index}
                                className="px-4 py-2 bg-neutral rounded-lg hover:bg-error cursor-pointer hover:text-neutral"
                                onClick={() => createAbsence(student.id)}
                              >
                                {`${student.user.name} ${student.user.surname}`}
                              </div>
                            ) : (
                              <span key={index} className={"hidden"}></span>
                            )
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th className="w-1/3 !bg-base-200">Absent: </th>
                    <td className="w-2/3 !bg-base-200">
                      <div className="flex flex-row flex-wrap gap-4">
                        {lesson?.data.class?.Student.map(
                          (student: StudentInterface, index: number) =>
                            student.Absence.length !== 0 ? (
                              <div
                                key={index}
                                className="px-4 py-2 bg-neutral rounded-lg hover:bg-accent cursor-pointer hover:text-neutral"
                                onClick={() =>
                                  deleteAbsence(student.Absence[0].id)
                                }
                              >
                                {`${student.user.name} ${student.user.surname}`}
                              </div>
                            ) : (
                              <span key={index} className={"hidden"}></span>
                            )
                        )}
                      </div>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        {AuthApi.isStudent() ||
        (AuthApi.isEmployee() &&
          authUser?.data.Employee?.id !== lesson?.data.employeeId) ? (
          <></>
        ) : (
          <button
            className="btn btn-outline btn-error mt-5 mr-5"
            onClick={() => setConfirmDeletePopupActive(true)}
          >
            Delete Lesson
          </button>
        )}
        {lesson?.data.lessonGroup === null ||
        AuthApi.isStudent() ||
        (AuthApi.isEmployee() &&
          authUser?.data.Employee?.id !== lesson?.data.employeeId) ? (
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
