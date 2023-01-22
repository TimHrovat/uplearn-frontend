import { Navigate } from "react-router-dom";
import { AuthApi } from "../../api/auth/auth-api";

export type ProtectedRouteAuthenticatedProps = {
  outlet: JSX.Element;
};

export default function ProtectedRouteAuthenticated({
  outlet,
}: ProtectedRouteAuthenticatedProps) {
  if (AuthApi.isAuthenticatedStrict()) {
    return outlet;
  } else {
    return <Navigate to={"/login"} />;
  }
}
