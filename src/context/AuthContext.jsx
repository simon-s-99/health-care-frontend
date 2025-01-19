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

  async function getUserData() {
    axios
      .get("http://localhost:5148/api/auth/check", {
        withCredentials: true,
      })
      .then((res) => { // If 200, set auth state
        const data = res.data;
        setAuthState({
          isAuthenticated: data.message === "Authenticated",
          userId: data.userId,
          username: data.username,
          roles: data.roles,
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) { // If 404 do not print an error
          console.log("Unauthorized. Please log in.");
        } else { // On other errors, print the error message
          console.log("Error: ", error);
        }
      });
  }

  useEffect(() => {
    if (!authState.isAuthenticated) getUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}
