import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ClassroomApi } from "../../api/classroom/classroom-api";
import Modal from "./Modal";

export type AddLessonModalProps = {
  active: boolean;
  date: string;
  schoolHourId: string;
  onActiveChange: (active: boolean) => void;
};

export default function AddLessonModal({
  active,
  onActiveChange,
  date,
  schoolHourId,
}: AddLessonModalProps) {
  const { status: classroomsStatus, data: classrooms } = useQuery({
    queryKey: ["classrooms"],
    queryFn: () => ClassroomApi.whereNotInLesson(date, schoolHourId),
  });

  console.log(classrooms?.data);

  if (!active) return <></>;

  return (
    <>
      <Modal
        active={active}
        title={"Add lesson"}
        onActiveChange={(isActive) => onActiveChange?.(isActive)}
        fullWidth={true}
      >
        <div>{schoolHourId}</div>
        <div>{date}</div>
      </Modal>
    </>
  );
}
