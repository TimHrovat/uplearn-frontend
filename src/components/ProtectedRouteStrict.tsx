import { Navigate } from "react-router-dom";
import { AuthApi } from "../api/auth/auth-api";

export type ProtectedRouteStrictProps = {
  authenticationPath: string;
  outlet: JSX.Element;
};

export default function ProtectedRouteStrict({
  authenticationPath,
  outlet,
}: ProtectedRouteStrictProps) {
  if (AuthApi.isAuthenticatedStrict()) {
    return outlet;
  } else {
    return <Navigate to={{ pathname: authenticationPath }} />;
  }
}
