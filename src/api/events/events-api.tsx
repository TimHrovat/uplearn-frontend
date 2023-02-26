import axios from "axios";
import { EmployeeInterface } from "../../components/modals/SubjectEditModal";

const url = "/events";

export const EventsApi = {
  create: async (data: CreateEventInterface) => {
    return await axios.post(url + "/create", data);
  },
  getEventsByClassAndDateRange: async (
    className: string,
    startDate: string,
    endDate: string
  ) => {
    return await axios.get(
      `${url}/events-by-class-and-date-range/${className}/${startDate}/${endDate}`
    );
  },
  getEventsByEmployeeAndDateRange: async (
    employeeId: string,
    startDate: string,
    endDate: string
  ) => {
    return await axios.get(
      `${url}/events-by-employee-and-date-range/${employeeId}/${startDate}/${endDate}`
    );
  },
  delete: async (id: string) => {
    return await axios.delete(url + "/" + id);
  },
};

export interface CreateEventInterface {
  startTime?: string;
  date: string;
  endTime?: string;
  type: string;
  description?: string;
  employees: string[];
  classes: string[];
}

export interface EventInterface {
  id: string;
  startTime?: string;
  date: string;
  endTime?: string;
  type: string;
  description?: string;
  Event_Teacher: [{ employee: EmployeeInterface }];
  Event_Class: [{ class: ClassInterface }];
}

interface ClassInterface {
  name: string;
}
