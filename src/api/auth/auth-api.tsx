const url = process.env.REACT_APP_API_URL + "/auth";

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
    await fetch(url + "/logout", {
      method: "GET",
      credentials: "include",
    });
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
