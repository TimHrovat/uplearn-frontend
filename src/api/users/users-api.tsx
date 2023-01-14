import { AuthApi } from "../auth/auth-api";

const url = process.env.REACT_APP_API_URL + "/users";

export const UsersApi = {
  create: async function (userData: {
    name: string;
    surname: string;
    email: string;
    dateOfBirth: string;
    firstPassword: string;
    role: string;
  }) {
    const response = await fetch(url + "/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    return response.json();
  },
  getAll: async function () {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    return response.json();
  },
  getAuthenticatedUser: async function () {
    try {
      const payload = AuthApi.getJwtPayload("token");

      const response = await fetch(url + "/" + payload.id, {
        method: "GET",
        credentials: "include",
      });

      return response.json();
    } catch (e) {
      return null;
    }
  },
  delete: async function (id: string) {
    const response = await fetch(url + "/" + id, {
      method: "DELETE",
      credentials: "include",
    });

    return response.json();
  },
};
