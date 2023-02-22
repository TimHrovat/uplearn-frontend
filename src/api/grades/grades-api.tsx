import axios from "axios";

const url = "/grades";

export const GradesApi = {
  create: async (data: CreateGradeInterface) => {
    return await axios.post(url + "/create", data);
  },
  getByStudentAndSubject: async (
    studentId: string,
    subjectAbbreviation: string
  ) => {
    return await axios.get(
      url + "/student-subject/" + studentId + "/" + subjectAbbreviation
    );
  },
  getByStudent: async (studentId: string) => {
    return await axios.get(url + "/student/" + studentId);
  },
  update: async (id: string, data: UpdateGradeInterface) => {
    return await axios.patch(url + "/" + id, data);
  },
  delete: async (id: string) => {
    return await axios.delete(url + "/" + id);
  },
};

export interface CreateGradeInterface {
  value: number;
  type: "ORAL" | "WRITTEN" | "OTHER";
  description?: string;
  studentId: string;
  subjectAbbreviation: string;
}

export interface UpdateGradeInterface {
  value: number;
}
