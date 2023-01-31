import axios from "axios";

const url = "/employees";

export const EmployeesApi = {
  getAll: async () => {
    return await axios.get(url)
  },
  getNonClassTeachers: async () => {
    return await axios.get(url + "/non-class-teachers")
  },
  getNonSubstituteClassTeachers: async () => {
    return await axios.get(url + "/non-substitute-class-teachers")
  }
};
