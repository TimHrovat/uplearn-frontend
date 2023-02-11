import axios from "axios";

const url = process.env.REACT_APP_API_URL + "/auth";

const url2 = "/auth"

export const AuthApi = {
  login: async function (userData: { username: string; password: string }) {
    return await fetch(url + "/login", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  },
  logout: async function () {
    return await axios.get(url2 + "/logout");
  },
  replaceFirstPassword: async function (newPassword: string) {
    const response = await fetch(url + "/replace-first-password", {
      method: "PATCH",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: newPassword }),
    });

    return response.json();
  },
  getJwtPayload: getJwtPayload,
  isAuthenticated: function () {
    const token = getJwtPayload("token");

    if (token !== undefined && !token.firstPasswordReplaced) return true;

    return false;
  },
  isAuthenticatedStrict: function () {
    const token = getJwtPayload("token");

    if (token !== undefined && token.firstPasswordReplaced) return true;

    return false;
  },
  isAdmin: function () {
    const token = getJwtPayload("token");

    if (token !== undefined && token.role === "admin") return true;

    return false;
  },
  isStudent: function () {
    const token = getJwtPayload("token");

    if (token !== undefined && token.role === "student") return true;

    return false;
  },
  isEmployee: function () {
    const token = getJwtPayload("token");

    if (token !== undefined && token.role === "employee") return true;

    return false;
  },
  getRole: function () {
    const token = getJwtPayload("token");

    if (token !== undefined && token.role) return token.role;

    return null;
  },
  register: async function (userData: {
    name: string;
    surname: string;
    email: string;
    gsm: string;
    dateOfBirth: string;
    role: string;
  }) {
    return await fetch(url + "/register", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  },
};

function getJwtPayload(name: string) {
  const value = `; ${document.cookie}`;
  try {
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const popped = parts.pop();

      if (!popped) return null;

      const jwtToken = popped.split(";").shift()?.substring(6);

      if (!jwtToken) return null;

      return parseJwt(jwtToken);
    }
  } catch (e) {
    return null;
  }
}

function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
