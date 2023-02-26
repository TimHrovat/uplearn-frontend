import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  AbsenceInterface,
  AbsencesApi,
} from "../../../api/absences/absences-api";
import { AuthApi } from "../../../api/auth/auth-api";
import { ClassesApi } from "../../../api/classes/classes-api";
import { UsersApi } from "../../../api/users/users-api";
import ErrorAlert from "../../../components/alerts/ErrorAlert";
import Loader from "../../../components/Loader";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { style } from "../../../components/ReactSelectStyle";
import { StudentInterface } from "../../../components/modals/classes/ClassStudentsModal";

const animatedComponents = makeAnimated();
let classOptions: { value: string; label: string }[] = [];
let studentOptions: { value: string; label: string }[] = [];

export default function ManageAbsences() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const { status: authUserStatus, data: authUser } = useQuery({
    queryKey: ["authenticatedUser"],
    queryFn: UsersApi.getAuthenticatedUser,
  });

  const {
    status: classesStatus,
    data: classes,
    refetch: refetchClasses,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      if (AuthApi.isAdmin()) return await ClassesApi.getAll();
      else
        return await ClassesApi.getByClassTeacher(authUser?.data.Employee?.id);
    },
    enabled: authUser?.data !== undefined,
  });

  const {
    data: absences,
    refetch: refetchAbsences,
    remove: removeAbsences,
  } = useQuery({
    queryKey: ["absences"],
    queryFn: () => AbsencesApi.getByStudent(selectedStudent),
    enabled: selectedStudent !== "",
  });

  useEffect(() => {
    if (selectedClass !== "" && selectedStudent !== "") refetchAbsences();
  }, [refetchAbsences, selectedClass, selectedStudent]);

  if (classesStatus === "loading" || authUserStatus === "loading")
    return <Loader active={true} />;
  if (classesStatus === "error" || authUserStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  classOptions = [];
  classes?.data.forEach((classOption: { name: string }) => {
    classOptions.push({
      value: classOption.name,
      label: classOption.name,
    });
  });

  const handleSelectedClass = (selected: any) => {
    setSelectedClass(selected.value);

    studentOptions = [];

    setSelectedStudent("");

    const foundClass = classes?.data.find(
      (classOption: { name: string }) => classOption.name === selected.value
    );

    foundClass.Student?.forEach((student: StudentInterface) => {
      studentOptions.push({
        value: student.id,
        label: `${student.user.name} ${student.user.surname}`,
      });
    });

    refetchClasses();

    removeAbsences();
  };

  const handleSelectedStudent = (selected: any) => {
    setSelectedStudent(selected.value);
  };

  const toDateString = (isodate: string) => {
    const date = new Date(isodate);

    const dateStr: string = `${date.getDate()}. ${
      date.getMonth() + 1
    }. ${date.getFullYear()}`;

    return dateStr;
  };

  const setExcused = async (id: string) => {
    await AbsencesApi.setExcused(id);

    await refetchAbsences();
  };

  const setUnexcused = async (id: string) => {
    await AbsencesApi.setUnexcused(id);

    await refetchAbsences();
  };

  if (classes?.data.length === 0) {
    return (
      <>
        <div className="flex flex-col justify-center items-center">
          <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
            <h1 className="text-xl font-bold mb-5">Absences</h1>
            <span className="text-error">
              You are not a class teacher or a substitute class teacher of any
              class
            </span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="bg-base-200 p-4 rounded-xl desktop:w-7/12 w-full max-w-screen-xl mb-5">
          <h1 className="text-xl font-bold mb-5">Absences</h1>
          <div className="flex flex-row">
            <div className="form-control mb-5 mr-5 min-w-[10rem]">
              <label className="label">
                <span className="label-text">Class:</span>
              </label>
              <Select
                options={classOptions}
                closeMenuOnSelect={true}
                components={animatedComponents}
                onChange={handleSelectedClass}
                styles={style}
              />
            </div>
            <div className="form-control mb-5 min-w-[15rem]">
              <label className="label">
                <span className="label-text">Student:</span>
              </label>
              <Select
                options={studentOptions}
                closeMenuOnSelect={true}
                isDisabled={selectedClass === ""}
                components={animatedComponents}
                onChange={handleSelectedStudent}
                {...(selectedStudent === "" ? { value: null } : {})}
                styles={style}
              />
            </div>
          </div>
          <span className="mr-5">{`Excused: ${
            absences?.data.excused ?? "--"
          }`}</span>
          <span>{`Unexcused: ${absences?.data.unexcused ?? "--"}`}</span>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <td></td>
                  <th>State</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {absences?.data.lessons?.length === 0 ? (
                  <tr className="text-center">
                    <td colSpan={5}>There are no absences</td>
                  </tr>
                ) : (
                  absences?.data.lessons?.map(
                    (absence: AbsenceInterface, index: number) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{absence.state}</td>
                        <td>{absence.lesson.subjectAbbreviation}</td>
                        <td>{toDateString(absence.lesson.date)}</td>
                        <td>
                          {absence.state === "EXCUSED" ? (
                            <button
                              className="btn btn-error btn-outline"
                              onClick={() => setUnexcused(absence.id)}
                            >
                              Set Unexcused
                            </button>
                          ) : (
                            <button
                              className="btn btn-accent btn-outline"
                              onClick={() => setExcused(absence.id)}
                            >
                              Set Excused
                            </button>
                          )}
                        </td>
                      </tr>
                    )
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
