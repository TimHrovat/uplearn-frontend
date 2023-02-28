import axios from "axios";

const url = "/auth";

export const AuthApi = {
  login: async function (userData: { username: string; password: string }) {
    return await axios.post(url + "/login", userData).then((rsp) => {
      if (rsp) {
        localStorage.setItem("token", rsp.data.token);
        axios.defaults.headers.common["Authorization"] = rsp.data.token;
      }
    });
  },
  logout: async function () {
    return await axios.get(url + "/logout").then((rsp) => {
      if (rsp) {
        localStorage.setItem("token", rsp.data.token);
        axios.defaults.headers.common["Authorization"] = null;
      }
    });
  },
  replaceFirstPassword: async function (newPassword: string) {
    return await axios
      .patch(url + "/replace-first-password", {
        password: newPassword,
      })
      .then((rsp) => {
        if (rsp) {
          localStorage.setItem("token", rsp.data.token);
          axios.defaults.headers.common["Authorization"] = rsp.data.token;
        }
      });
  },
  getJwtPayload: getJwtPayload,
  isAuthenticated: function () {
    const token = getJwtPayload("token");

    if (token !== null && !token.firstPasswordReplaced) return true;

    return false;
  },
  isAuthenticatedStrict: function () {
    const token = getJwtPayload("token");

    if (token !== null && token.firstPasswordReplaced) return true;

    return false;
  },
  isAdmin: function () {
    const token = getJwtPayload("token");

    if (token !== null && token.role === "admin") return true;

    return false;
  },
  isStudent: function () {
    const token = getJwtPayload("token");

    if (token !== null && token.role === "student") return true;

    return false;
  },
  isEmployee: function () {
    const token = getJwtPayload("token");

    if (token !== null && token.role === "employee") return true;

    return false;
  },
  getRole: function () {
    const token = getJwtPayload("token");

    if (token !== null && token.role) return token.role;

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
    return await axios.post(url + "/register", userData);
  },
  resendCredentials: async function (id: string) {
    return await axios.get(url + "/resend-credentials/" + id);
  },
  sendForgotPasswordEmail: async function (username: string) {
    return await axios.get(url + "/send-reset-password-email/" + username);
  },
  resetPassword: async function (token: string, password: string) {
    return await axios.post(url + "/reset-password/" + token, { password });
  },
};

function getJwtPayload(name: string) {
  // const value = `; ${document.cookie}`;
  // try {
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) {
  //     const popped = parts.pop();

  //     if (!popped) return null;

  //     const jwtToken = popped.split(";").shift()?.substring(6);

  //     if (!jwtToken) return null;

  //     return parseJwt(jwtToken);
  //   }
  // } catch (e) {
  //   return null;
  // }

  const token = localStorage.getItem("token");

  if (token === "" || token === null || token === "undefined") return null;

  return parseJwt(token);
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
