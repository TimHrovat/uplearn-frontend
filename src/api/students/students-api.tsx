import axios from "axios";

const url = "/students";

export const StudentsApi = {
  getAll: async () => {
    return await axios.get(url);
  },
  getAllWithoutClass: async () => {
    return await axios.get(url + "/without-class");
  },
};
