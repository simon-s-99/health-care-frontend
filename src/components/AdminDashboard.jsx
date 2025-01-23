import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/health_care_logo.svg";
import Logout from "./Logout";
function AdminDashboard() {
  const {
    authState: { user },
  } = useAuth();
  const [users, setUsers] = useState([]);

  return (
    <div>
      <img src={Logo} />
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user}!</p>
      <Logout />
    </div>
  );
}

export default AdminDashboard;
