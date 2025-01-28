'use client';
import { AuthenticatedUser } from "@/lib/types";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

interface AuthContext {
  authState: AuthenticatedUser;
  setAuthState: React.Dispatch<React.SetStateAction<AuthenticatedUser>>;
}

// authentication context to handle global auth
export const AuthContext = createContext<AuthContext>({
  authState: {
    isAuthenticated: null,
    username: null,
    userId: null,
    roles: null
  },
  setAuthState: () => { }
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthenticatedUser>({
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
        console.log("data == ", data);
        setAuthState({
          isAuthenticated: data.message === "Authenticated",
          userId: data.userId,
          username: data.username,
          roles: data.roles,
        });
        console.log("authstate == ", authState);
      })
      .catch((error) => {
        if (error.response && error.response.status !== 401) { // If 404 do not print an error
          console.log("Error: ", error);
        }
      });
  }

  useEffect(() => {
    if (!authState.isAuthenticated) {
      getUserData();
    }
  });

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}
