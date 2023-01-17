import { AuthApi } from "../auth/auth-api";

const url = process.env.REACT_APP_API_URL + "/users";

export const UsersApi = {
  create: async function (userData: {
    name: string;
    surname: string;
    email: string;
    dateOfBirth: string;
    role: string;
  }) {
    return await fetch(url + "/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });
  },
  getAll: async function () {
    return await fetch(url, {
      method: "GET",
      credentials: "include",
    });
  },
  getAuthenticatedUser: async function () {
    const payload = AuthApi.getJwtPayload("token");

    return await fetch(url + "/" + payload.id, {
      method: "GET",
      credentials: "include",
    });
  },
  delete: async function (id: string) {
    return await fetch(url + "/" + id, {
      method: "DELETE",
      credentials: "include",
    });
  },
};
