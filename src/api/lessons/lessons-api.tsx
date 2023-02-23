import axios from "axios";

const url = "/lessons";

export const LessonsApi = {
  create: async (data: CreateLessonInterface) => {
    return await axios.post(url + "/create", data);
  },
  createMany: async (data: CreateLessonInterface) => {
    return await axios.post(url + "/create-many/", data);
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
  getLessonsByEmployeeAndDateRange: async (
    employeeId: string,
    startDate: string,
    endDate: string
  ) => {
    return await axios.get(
      `${url}/lessons-by-employee-and-date-range/${employeeId}/${startDate}/${endDate}`
    );
  },
  getAll: async () => {
    return await axios.get(url);
  },
  getUnique: async (id: string) => {
    return await axios.get(url + "/" + id);
  },
  getUpcomingGradings: async (className: string) => {
    return await axios.get(url + "/upcoming-gradings/" + className);
  },
  delete: async (id: string) => {
    return await axios.delete(url + "/" + id);
  },
  deleteMany: async (lessonGroupId: string) => {
    return await axios.delete(url + "/delete-many/" + lessonGroupId);
  },
};

export interface CreateLessonInterface {
  description?: string;
  date: string;
  type: string;
  lessonGroup?: string;
  employeeId?: string | null;
  subjectAbbreviation?: string | null;
  substituteEmployeeId?: string | null;
  className: string;
  classroomName: string;
  schoolHourId: string;
}
