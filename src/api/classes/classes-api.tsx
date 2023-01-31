import axios from "axios";

const url = "/classes";

export const ClassesApi = {
  create: async (data: CreateClass) => {
    return await axios.post(url + "/create", data);
  },
};

export type CreateClass = {
  name: string;
  year: number;
  subjectListId: string;
  students?: { label: string; value: string }[];
  classTeacherId: string;
  substituteClassTeacherId: string;
};
