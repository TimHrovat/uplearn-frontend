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
};
