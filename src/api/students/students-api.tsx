import axios from "axios";

const url = "/students";

export const StudentsApi = {
  getAll: async () => {
    return await axios.get(url);
  },
  getAllWithoutClass: async () => {
    return await axios.get(url + "/without-class");
  },
  removeFromClass: async (id: string) => {
    return await axios.patch(url + "/remove-from-class/" + id);
  },
  getByClassAndSubject: async (className: string, subject: string) => {
    return await axios.get(url + "/class-subject/" + className + "/" + subject);
  },
  getSubjectsWithGrades: async (id: string) => {
    return await axios.get(url + "/subjects-and-grades/" + id);
  },
};
