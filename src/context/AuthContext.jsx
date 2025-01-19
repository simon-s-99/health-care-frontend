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
    const {data} = await axios.get("http://localhost:5148/api/auth/check", {
      withCredentials: true,
    });
    setAuthState({
      isAuthenticated: data.message === "Authenticated",
      userId: data.userId,
      username: data.username,
      roles: data.roles,
    });
  }

  useEffect(() => {
    getUserData();
  }, []);
  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}
