import { Navigate } from "react-router-dom";

export type ProtectedRouteStrictProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
  outlet: JSX.Element;
};

export default function ProtectedRouteStrict({
  isAuthenticated,
  authenticationPath,
  outlet,
}: ProtectedRouteStrictProps) {
  if (isAuthenticated) {
    return outlet;
  } else {
    return <Navigate to={{ pathname: authenticationPath }} />;
  }
}
