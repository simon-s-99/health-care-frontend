import axios from "axios";
import { createContext, useEffect, useState } from "react";
// authentication context to handle global auth
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    roles: [],
  });

  async function getUserData() {
    const token = document.cookie;
    console.log(token)
    // const data = await axios.get("http://localhost:5148/api/auth/check", {
    //   headers: {
    //     Authorization: `Bearer `
    //   }
    // });
    // console.log(data)
    // setAuthState({
    //   isAuthenticated: data.isAuthenticated,
    //   user: data.user,
    //   roles: data.roles
    // })
  }

  useEffect(() => {
    getUserData();
  })
  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
