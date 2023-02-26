import axios from "axios";

const url = "/employee-grades";

export const EmployeeGradesApi = {
  create: async (data: CreateEmployeeGradeInterface) => {
    return await axios.post(url + "/create", data);
  },
  getByStudent: async (studentId: string) => {
    return await axios.get(url + "/by-student/" + studentId);
  },
  getByEmployee: async (employeeId: string) => {
    return await axios.get(url + "/by-employee/" + employeeId);
  },
  update: async (id: string, data: UpdateEmployeeGradeInterface) => {
    return await axios.patch(url + "/" + id, data);
  },
};

export interface CreateEmployeeGradeInterface {
  value: number;
  comment?: string;
  employeeId: string;
  studentId: string;
}

export interface EmployeeGradeInterface {
  id: string;
  value: number;
  comment?: string;
  employeeId: string;
  studentId: string;
}

export interface UpdateEmployeeGradeInterface {
  value?: number;
  comment?: string;
}
