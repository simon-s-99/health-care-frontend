import useAuth from "@/hooks/useAuth";
import { AuthenticatedUser } from "@/lib/types";

export default function useIsAuthorized(requiredRoles: string[]): boolean {
  const user: AuthenticatedUser = useAuth();

  if (requiredRoles && user.roles &&
    requiredRoles.some((role) => user.roles!.includes(role))) {
    return true;
  }

  return false;
}
