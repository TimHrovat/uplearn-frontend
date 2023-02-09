import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { LessonsApi } from "../../api/lessons/lessons-api";
import ErrorAlert from "../alerts/ErrorAlert";
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
  const [loading, setLoading] = useState(false);

  const { data: lesson } = useQuery({
    queryKey: ["lesson"],
    queryFn: () => LessonsApi.getUnique(lessonId),
  });

  if (!active) return <></>;

  return (
    <>
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
      </Modal>
    </>
  );
}
