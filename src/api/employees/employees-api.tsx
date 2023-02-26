import axios from "axios";

const url = "/employees";

export const EmployeesApi = {
  getAll: async () => {
    return await axios.get(url);
  },
  getNonClassTeachers: async () => {
    return await axios.get(url + "/non-class-teachers");
  },
  getNonSubstituteClassTeachers: async () => {
    return await axios.get(url + "/non-substitute-class-teachers");
  },
  getAllNotInSubject: async (abbr: string) => {
    return await axios.get(url + "/not-in-subject/" + abbr);
  },
  removeFromSubject: async (id: string, abbr: string) => {
    return await axios.patch(url + "/remove-from-subject/" + id + "/" + abbr);
  },
  addToSubject: async (
    employees: { value: string; label: string }[],
    abbr: string
  ) => {
    const data = {
      employees,
      subjectAbbreviation: abbr,
    };

    return await axios.patch(url + "/add-to-subject", data);
  },
  getOngoingLesson: async (employeeId: string) => {
    return await axios.get(url + "/ongoing-lesson/" + employeeId);
  },
};
