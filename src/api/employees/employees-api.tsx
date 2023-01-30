import axios from "axios";

const url = "/employees";

export const EmployeesApi = {
  getAll: async () => {
    return await axios.get(url)
  },
};
