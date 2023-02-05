import axios from "axios";

const url = "/school-hours";

export const SchoolHoursApi = {
  create: async (data: CreateSchoolHour) => {
    return await axios.post(url + "/create", data);
  },
  getAll: async () => {
    return await axios.get(url);
  },
  delete: async (id: string) => {
    return await axios.delete(url + "/" + id);
  },
  update: async (id: string, data: UpdateSchoolHour) => {
    return await axios.patch(url + "/" + id, data);
  }
};

export interface CreateSchoolHour {
  startTime: string;
}

export interface UpdateSchoolHour {
  startTime: string;
}
