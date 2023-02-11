import axios from "axios";
import { AuthApi } from "../auth/auth-api";

const url = "/users";

export const UsersApi = {
  getAll: async function (adminId: string) {
    return await axios.get(url + "/get-all/" + adminId);
  },
  getAuthenticatedUser: async function () {
    const payload = AuthApi.getJwtPayload("token");

    return await axios.get(url + "/" + payload.id);
  },
  getUnique: async function (id: string) {
    return await axios.get(url + "/" + id);
  },
  upateAuthenticatedUser: async function (updatedData: {
    username?: string;
    currentPassword?: string;
    password?: string;
    email?: string;
    gsm?: string;
  }) {
    return await axios.patch(url + "/update-authenticated", updatedData);
  },
  delete: async function (id: string) {
    return await axios.delete(url + "/" + id);
  },
  update: async function (id: string, data: UpdateUserInterface) {
    return await axios.patch(url + "/update/" + id, data);
  },
};

interface UpdateUserInterface {
  gsm?: string;
  name?: string;
  surname?: string;
  email?: string;
}
