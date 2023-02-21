import axios from "axios";

const url = "/grades";

export const GradesApi = {
  create: async (data: CreateGradeInterface) => {
    return await axios.post(url + "/create", data);
  },
};

export interface CreateGradeInterface {
  value: number;
  type: "ORAL" | "WRITTEN" | "OTHER";
  description?: string;
  studentId: string;
  subjectAbbreviation: string;
}
