import axios from "axios";
import { AuthApi } from "../auth/auth-api";

const url = process.env.REACT_APP_API_URL + "/users";

const url2 = "/users";

export const UsersApi = {
  getAll: async function (adminId: string) {
    return await axios.get(url2 + "/get-all/" + adminId);
  },
  getAuthenticatedUser: async function () {
    const payload = AuthApi.getJwtPayload("token");

    return await axios.get(url2 + "/" + payload.id);
  },
  upateAuthenticatedUser: async function (updatedData: {
    username?: string;
    currentPassword?: string;
    password?: string;
    email?: string;
    gsm?: string;
  }) {
    return await axios.patch(url2 + "/update-authenticated", updatedData);
  },
  delete: async function (id: string) {
    return await axios.delete(url2 + "/" + id);
  },
};
