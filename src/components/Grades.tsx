import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { gradeColors, GradesApi } from "../api/grades/grades-api";
import { StudentsApi } from "../api/students/students-api";
import { GradeInterface } from "../pages/dashboard/employee/ManageGrades";
import ErrorAlert from "./alerts/ErrorAlert";
import Loader from "./Loader";

interface GradesProps {
  studentId: string;
}

export default function Grades({ studentId }: GradesProps) {
  const [error, setError] = useState("");

  const { status, data: subjects } = useQuery({
    queryKey: ["studentGrades"],
    queryFn: () => StudentsApi.getSubjectsWithGrades(studentId),
  });

  if (status === "loading") return <Loader active={true} />;
  if (status === "error")
    return (
      <ErrorAlert
        msg={"Page couldn't load"}
        onVisibilityChange={(msg) => setError(msg)}
      />
    );

  if (subjects?.data.length === 0)
    return (
      <>
        <div className="h-2/3 flex flex-row justify-center content-center text-error">
          <span>
            You are not assigned to a class, please contact school management
          </span>
        </div>
      </>
    );

  const calcAvgGrade = (grades: GradeInterface[]) => {
    let len = 0;

    grades.forEach((grade) => {
      if (grade.value !== 0) len++;
    });

    if (len === 0) return "/";

    return (grades.reduce((sum, grade) => sum + grade.value, 0) / len).toFixed(
      2
    );
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Subject abbr</th>
              <th>Subject name</th>
              <th>Grades</th>
              <th>Avg</th>
            </tr>
          </thead>
          <tbody>
            {subjects?.data.map(
              (subject: SubjectGradeInterface, index: number) => (
                <tr key={index}>
                  <td>{subject.abbreviation}</td>
                  <td>{subject.name}</td>
                  <td>
                    <div className="flex flex-row">
                      {subject.grades.map(
                        (grade: GradeInterface, index: number) => (
                          <span
                            key={index}
                            className={`mr-2 ${gradeColors[grade.type]}`}
                          >
                            {grade.value === 0 ? "NPS" : grade.value}
                          </span>
                        )
                      )}
                    </div>
                  </td>
                  <td>{calcAvgGrade(subject.grades)}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

interface SubjectGradeInterface {
  abbreviation: string;
  name: string;
  grades: [GradeInterface];
}
