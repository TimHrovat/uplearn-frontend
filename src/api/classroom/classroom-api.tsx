import axios from "axios";

const url = "/classrooms";

export const ClassroomApi = {
  getAll: async () => {
    return await axios.get(url);
  },
  create: async (data: ClassroomCreateInterface) => {
    return await axios.post(url + "/create", data);
  },
  whereNotInLesson: async (date: string, schoolHourId: string) => {
    return await axios.get(
      url + "/where-not-in-lesson/" + date + "/" + schoolHourId
    );
  },
  delete: async (name: string) => {
    return await axios.delete(url + "/" + name);
  },
};

interface ClassroomCreateInterface {
  name: string;
  type: string;
}
