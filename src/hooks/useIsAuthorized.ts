import { AuthContext } from "@/app/AuthProvider";
import { useContext } from "react";

export default function useIsAuthorized(requiredRoles: string[]): boolean {
  const { authState } = useContext(AuthContext);

  if (requiredRoles && authState.roles &&
    requiredRoles.some((role) => authState.roles!.includes(role))) {
    return true;
  }

  return false;
}
