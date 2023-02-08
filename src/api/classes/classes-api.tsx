import axios from "axios";

const url = "/classes";

export const ClassesApi = {
  create: async (data: CreateClass) => {
    return await axios.post(url + "/create", data);
  },
  getAll: async () => {
    return await axios.get(url);
  },
  getUnique: async (name: string) => {
    return await axios.get(url + "/" + name);
  },
  update: async (name: string, data: UpdateClass) => {
    return await axios.patch(url + "/" + name, data);
  },
  connectToEmployeeSubject: async (
    name: string,
    data: ConnectToEmployeeSubject
  ) => {
    return await axios.post(url + "/connect-to-employee-subject/" + name, data);
  },
  delete: async (name: string) => {
    return await axios.delete(url + "/" + name);
  },
};

export interface CreateClass {
  name: string;
  year: number;
  subjectListId: string;
  students?: { label: string; value: string }[];
  classTeacherId: string;
  substituteClassTeacherId: string;
}

export interface UpdateClass {
  name?: string;
  year?: number;
  students?: { label: string; value: string }[];
  subjectListId?: string;
  classTeacherId?: string;
  substituteClassTeacherId?: string;
}

export interface ConnectToEmployeeSubject {
  employeeId: string;
  subjectAbbreviation: string;
}
