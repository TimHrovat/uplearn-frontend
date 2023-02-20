import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  ClassesApi,
  ConnectToEmployeeSubject,
} from "../../api/classes/classes-api";
import ErrorAlert from "../alerts/ErrorAlert";
import Modal from "./Modal";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import Loader from "../Loader";

export type ClassAssignTeacherToSubjectModalProps = {
  active: boolean;
  modalClassName: string;
  onActiveChange: (active: boolean) => void;
};

const animatedComponents = makeAnimated();

export default function ClassAssignTeacherToSubjectModal({
  active,
  onActiveChange,
  modalClassName,
}: ClassAssignTeacherToSubjectModalProps) {
  const [error, setError] = useState("");

  const {
    status: classStatus,
    data: currentClass,
    refetch,
  } = useQuery({
    queryKey: ["class"],
    queryFn: () => ClassesApi.getUnique(modalClassName),
    enabled: active,
  });

  useEffect(() => {
    if (active) refetch();
    console.log("refetch");
  }, [active, refetch]);

  if (classStatus === "loading") return <Loader active={true} />;
  if (classStatus === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  const handleSelectedTeacher = async (selected: any, subjectAbbr: string) => {
    const data: ConnectToEmployeeSubject = {
      subjectAbbreviation: subjectAbbr,
      employeeId: selected.value,
    };

    await ClassesApi.connectToEmployeeSubject(modalClassName, data);

    refetch();
  };

  const getDefaultValue = (subjectAbbr: string) => {
    const found = currentClass?.data.Employee_Subject_Class.find(
      (s: { subjectAbbreviation: string }) =>
        s.subjectAbbreviation === subjectAbbr
    );

    if (found !== undefined) {
      const user = found.employee_Subject.employee.user;

      const defaultValue = {
        label: user.name + " " + user.surname,
        value: found.employeeId,
      };

      return defaultValue;
    }

    return null;
  };

  if (!active || currentClass?.data.name !== modalClassName) return <></>;

  return (
    <>
      <ErrorAlert msg={error} onVisibilityChange={(msg) => setError(msg)} />
      <Modal
        active={active}
        title={"Assign Subject Teachers - " + modalClassName}
        onActiveChange={(isActive) => onActiveChange?.(isActive)}
      >
        <div className="flex flex-col">
          {currentClass?.data.subjectList?.Subject_SubjectList?.map(
            (s: SubjectInterface, index: number) => (
              <div
                className="flex flex-row items-center justify-center"
                key={index}
              >
                <div className="mr-10">{s.subject.abbreviation}</div>
                <div className="tablet:w-1/2 w-full">
                  <div className="form-control w-full mb-5">
                    <label className="label">
                      <span className="label-text">Employee:</span>
                    </label>
                    <Select
                      options={s.subject.Employee_Subject.map(
                        (e: EmployeeInterface, index: number) => {
                          return {
                            label:
                              e.employee.user.name +
                              " " +
                              e.employee.user.surname,
                            value: e.employee.id,
                          };
                        }
                      )}
                      closeMenuOnSelect={true}
                      components={animatedComponents}
                      defaultValue={getDefaultValue(s.subject.abbreviation)}
                      onChange={(selected) =>
                        handleSelectedTeacher(selected, s.subject.abbreviation)
                      }
                      styles={{
                        option: (styles) => ({
                          ...styles,
                          color: "black",
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </Modal>
    </>
  );
}

export interface SubjectInterface {
  subject: {
    abbreviation: string;
    Employee_Subject: [EmployeeInterface];
  };
}

export interface EmployeeInterface {
  employee: {
    id: string;
    user: {
      name: string;
      surname: string;
      id: string;
    };
  };
}
