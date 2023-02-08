import { faAdd, faDoorOpen, faScroll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import AddLessonModal from "../modals/AddLessonModal";

export interface TimetableLessonProps {
  subject?: string;
  teacher?: string;
  classroom?: string;
  schoolHourId: string;
  date: string;
  className: string;
  type: string;
  onClose: () => any;
}

export default function TimetableLesson({
  subject,
  teacher,
  classroom,
  schoolHourId,
  date,
  type,
  className,
  onClose,
}: TimetableLessonProps) {
  const [addLessonModalActive, setAddLessonModalActive] = useState(false);
  const [showAddIcon, setShowAddIcon] = useState(false);

  return (
    <>
      {addLessonModalActive ? (
        <AddLessonModal
          active={addLessonModalActive}
          onActiveChange={(active) => {
            setAddLessonModalActive(active);
            onClose();
          }}
          schoolHourId={schoolHourId}
          date={date}
          className={className}
        />
      ) : (
        <></>
      )}
      <div
        className="min-w-fit min-h-[4rem] hover:bg-primary rounded-md cursor-pointer p-4"
        onClick={() => setAddLessonModalActive(true)}
        onMouseEnter={() => setShowAddIcon(classroom === "" ? true : false)}
        onMouseLeave={() => setShowAddIcon(false)}
      >
        {!showAddIcon ? (
          <></>
        ) : (
          <div className="flex flex-row justify-center items-center">
            <FontAwesomeIcon icon={faAdd} />
          </div>
        )}
        {classroom === "" ? (
          <></>
        ) : (
          <>
            <div className="block w-full">
              <span className="font-bold mr-8">
                {type === "SUBSTITUTE" ? "Substitute" : subject}
              </span>
              {type === "GRADING" ? (
                <span className="text-info float-right">
                  <FontAwesomeIcon icon={faScroll} />
                </span>
              ) : (
                <></>
              )}
            </div>
            <span className="mb-4 font-thin block">{teacher}</span>
            <div className="block">
              <FontAwesomeIcon icon={faDoorOpen} />
              <span className="ml-3">{classroom}</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
