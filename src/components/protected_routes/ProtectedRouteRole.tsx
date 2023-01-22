import { Navigate } from "react-router-dom";
import { AuthApi } from "../../api/auth/auth-api";

export type ProtectedRouteRoleProps = {
  authorizedRoles: string[];
  outlet: JSX.Element;
};

export default function ProtectedRouteRole({
  authorizedRoles,
  outlet,
}: ProtectedRouteRoleProps) {
  let isAuthorized = false;

  authorizedRoles.forEach((role) => {
    if (role === AuthApi.getRole()) isAuthorized = true;
  });

  if (isAuthorized) return outlet;

  return <Navigate to={"/login"} />;
}
