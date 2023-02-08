import axios from "axios";

const url = "/lessons";

export const LessonsApi = {
  create: async (data: CreateLessonInterface) => {
    return await axios.post(url + "/create", data);
  },
  getLessonsByClassAndDateRange: async (
    className: string,
    startDate: string,
    endDate: string
  ) => {
    return await axios.get(
      `${url}/lessons-by-class-and-date-range/${className}/${startDate}/${endDate}`
    );
  },
  getAll: async () => {
    return await axios.get(url);
  },
};

export interface CreateLessonInterface {
  description?: string;
  date: string;
  type: string;
  employeeId?: string | null;
  subjectAbbreviation?: string | null;
  substituteEmployeeId?: string | null;
  className: string;
  classroomName: string;
  schoolHourId: string;
}
