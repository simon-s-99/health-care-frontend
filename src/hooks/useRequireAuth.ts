import { useEffect } from "react";
import { useAuth } from "./useAuth";

// custom hook to check authentication
// i App allowed roles are specified
export const useRequireAuth = (allowedRoles) => {
  const {
    authState: { isAuthenticated, roles },
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (
      allowedRoles &&
      !allowedRoles.some((role) => roles.includes(role))
    ) {
      navigate("/unauthorized", { replace: true });
    }
  }, [isAuthenticated, roles, allowedRoles, navigate]);

  return { isAuthenticated, roles };
};
