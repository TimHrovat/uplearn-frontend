import {
  faCalendar,
  faPenToSquare,
  faPeopleGroup,
  faPersonChalkboard,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ClassesApi } from "../../../api/classes/classes-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import Loader from "../../../components/Loader";
import ClassAssignTeacherToSubjectModal from "../../../components/modals/classes/ClassAssignTeacherToSubjectModal";
import ClassEditModal from "../../../components/modals/classes/ClassEditModal";
import ClassStudentsModal from "../../../components/modals/classes/ClassStudentsModal";
import ClassTimetableModal from "../../../components/modals/classes/ClassTimetableModal";
import ConfirmDeletePopup from "../../../components/modals/popups/ConfirmDeletePopup";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageClasses() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [studentsModalActive, setStudentModalActive] = useState(false);
  const [classEditModalActive, setClassEditModalActive] = useState(false);
  const [classTimetableModalActive, setClassTimetableModalActive] =
    useState(false);
  const [confirmDeletePopupActive, setConfirmDeletePopupActive] =
    useState(false);
  const [
    assignTeacherToSubjectModalActive,
    setAssignTeacherToSubjectModalActive,
  ] = useState(false);
  const [modalClassName, setModalClassName] = useState("");

  const {
    status: classesStatus,
    data: classes,
    refetch,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: ClassesApi.getAll,
  });

  if (classesStatus === "loading") return <Loader active={true} />;
  if (classesStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  const deleteClass = async (name: string) => {
    await ClassesApi.delete(name);

    refetch();
  };

  return (
    <>
      <ClassStudentsModal
        active={studentsModalActive}
        modalClassName={modalClassName}
        onActiveChange={(active) => setStudentModalActive(active)}
      />
      <ClassAssignTeacherToSubjectModal
        active={assignTeacherToSubjectModalActive}
        modalClassName={modalClassName}
        onActiveChange={(active) =>
          setAssignTeacherToSubjectModalActive(active)
        }
      />
      <ClassEditModal
        active={classEditModalActive}
        modalClassName={modalClassName}
        onActiveChange={(active) => {
          setClassEditModalActive(active);
          refetch();
        }}
      />
      <ClassTimetableModal
        active={classTimetableModalActive}
        modalClassName={modalClassName}
        onActiveChange={(active) => setClassTimetableModalActive(active)}
      />
      <ConfirmDeletePopup
        active={confirmDeletePopupActive}
        onActiveChange={(active) => setConfirmDeletePopupActive(active)}
        deleteFunction={() => {
          deleteClass(modalClassName);
          refetch();
        }}
        prompt={"Are you sure you want to delete class " + modalClassName + "?"}
      />
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <SuccessAlert
        msg={success}
        onVisibilityChange={(msg) => setSuccess(msg)}
      />
      <div className="flex flex-col justify-center items-center">
        <SubpageBtnList
          buttons={[
            { title: "View classes", link: "/dashboard/manage-classes" },
            { title: "Create class", link: "/dashboard/manage-classes/create" },
          ]}
        />
        <div className="bg-base-200 p-4 rounded-xl desktop:min-w-fit w-full mb-5">
          <h1 className="text-xl font-bold mb-5">View Classes</h1>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Year</th>
                  <th>class teacher</th>
                  <th>substitute class teacher</th>
                  <th>subject list name</th>
                  <th>assign teachers</th>
                  <th>students</th>
                  <th>timetable</th>
                  <th>edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {classes?.data.map((c: ClassInterface, index: number) => (
                  <tr key={c.name}>
                    <td>{index + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.year}</td>
                    <th>{`${c.classTeacher.user.name} ${c.classTeacher.user.surname}`}</th>
                    <th>{`${c.substituteClassTeacher.user.name} ${c.substituteClassTeacher.user.surname}`}</th>
                    <th>{c.subjectList.name}</th>
                    <td>
                      <button
                        className="btn btn-outline btn-info"
                        onClick={() => {
                          setAssignTeacherToSubjectModalActive(true);
                          setModalClassName(c.name);
                        }}
                      >
                        <FontAwesomeIcon icon={faPersonChalkboard} size="lg" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-info"
                        onClick={() => {
                          setStudentModalActive(true);
                          setModalClassName(c.name);
                        }}
                      >
                        <FontAwesomeIcon icon={faPeopleGroup} size="lg" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-info"
                        onClick={() => {
                          setModalClassName(c.name);
                          setClassTimetableModalActive(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faCalendar} size="lg" />
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-outline"
                        onClick={() => {
                          setClassEditModalActive(true);
                          setModalClassName(c.name);
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
                          setModalClassName(c.name);
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

export interface ClassInterface {
  name: string;
  year: string;
  subjectList: {
    name: string;
    Subject_SubjectList: {
      subject: {
        abbreviation: string;
        Employee_Subject: {
          employee: {
            user: {
              name: string;
              id: string;
            };
          };
        };
      };
    };
  };
  classTeacher: {
    user: {
      name: string;
      surname: string;
    };
  };
  substituteClassTeacher: {
    user: {
      name: string;
      surname: string;
    };
  };
}
