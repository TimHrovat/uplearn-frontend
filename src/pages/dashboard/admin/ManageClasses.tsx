import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ClassesApi } from "../../../api/classes/classes-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import SuccessAlert from "../../../components/alerts/SuccessAlert";
import Loader from "../../../components/Loader";
import ClassEditModal from "../../../components/modals/ClassEditModal";
import ClassStudentsModal from "../../../components/modals/ClassStudentsModal";
import SubpageBtnList from "../../../components/navbar/SubpageBtnList";

export default function ManageClasses() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [studentsModalActive, setStudentModalActive] = useState(false);
  const [classEditModalActive, setClassEditModalActive] = useState(false);
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
      <ClassEditModal
        active={classEditModalActive}
        modalClassName={modalClassName}
        onActiveChange={(active) => setClassEditModalActive(active)}
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
                  <th>class list name</th>
                  <th>students</th>
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
                          setStudentModalActive(true);
                          setModalClassName(c.name);
                        }}
                      >
                        View students
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
                        onClick={() => deleteClass(c.name)}
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

interface ClassInterface {
  name: string;
  year: string;
  subjectList: {
    name: string,
  }
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
