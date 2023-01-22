import { Navigate } from "react-router-dom";
import { AuthApi } from "../../api/auth/auth-api";

export type ProtectedRouteProps = {
  outlet: JSX.Element;
};

export default function ProtectedRoute({
  outlet,
}: ProtectedRouteProps) {
  if (AuthApi.isAuthenticated()) {
    return outlet;
  } else {
    return <Navigate to={"/login"} />;
  }
}
