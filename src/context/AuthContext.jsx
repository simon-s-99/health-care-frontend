import axios from "axios";
import { createContext, useEffect, useState } from "react";
// authentication context to handle global auth
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userId: "",
    username: "",
    roles: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await axios.get(
          "http://localhost:5148/api/auth/check",
          {
            withCredentials: true,
          }
        );

        if (!data) {
          throw new Error("Invalid user details.");
        }

        setAuthState({
          isAuthenticated: data.message === "Authenticated",
          userId: data.userId,
          username: data.username,
          roles: data.roles,
        });
      } catch (error) {
        if (error.response && error.response.status !== 401) {
          // If 401 do not print an error
          console.log("Error: ", error);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (!authState.isAuthenticated) getUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
