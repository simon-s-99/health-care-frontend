import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import Logout from "./Logout";
// div with styles

export default function UserDashboard() {
  // using custom hook to check if the user i authenticated and has the correct role
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);

  return (
    <div>
      <img src={Logo} />
      <h2>User Dashboard</h2>
      <p>Welcome, {user}!</p>
      <Logout />
    </div>
  );
}