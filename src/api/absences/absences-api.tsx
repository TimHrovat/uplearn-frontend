import axios from "axios";

const url = "/absences";

export const AbsencesApi = {
  create: async (data: CreateAbsenceInterface) => {
    return await axios.post(url + "/create", data);
  },
  delete: async (absenceId: string) => {
    return await axios.delete(url + "/" + absenceId);
  },
  setExcused: async (absenceId: string) => {
    return await axios.patch(url + "/set-excused/" + absenceId);
  },
  setUnexcused: async (absenceId: string) => {
    return await axios.patch(url + "/set-unexcused/" + absenceId);
  },
  getByStudent: async (studentId: string) => {
    return await axios.get(url + "/" + studentId);
  },
};

interface CreateAbsenceInterface {
  lessonId: string;
  studentId: string;
}

export interface AbsenceInterface {
  state: string;
  id: string;
  lesson: {
    date: string;
    subjectAbbreviation: string;
  };
}
