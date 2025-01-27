import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { AuthenticatedUser } from "@/lib/types";

export default function useAuth(): AuthenticatedUser {
  const { authState } = useContext(AuthContext);
  return authState;
}
