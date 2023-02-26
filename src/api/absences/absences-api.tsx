import axios from "axios";

const url = "/absences";

export const AbsencesApi = {
  create: async (data: CreateAbsenceInterface) => {
    return await axios.post(url + "/create", data);
  },
  delete: async (absenceId: string) => {
    return await axios.delete(url + "/" + absenceId);
  },
};

interface CreateAbsenceInterface {
  lessonId: string;
  studentId: string;
}
