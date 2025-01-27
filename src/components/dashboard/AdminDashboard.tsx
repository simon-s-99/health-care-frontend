import Image from "next/image";
import Logo from "../assets/health_care_logo.svg";
import { useSession } from "next-auth/react";

function AdminDashboard() {
  const session = useSession();

  return (
    <div>
      <Image alt="Health Care company logo" src={Logo} />
      <h2>Admin Dashboard</h2>
      <p>Welcome, {session.data?.user?.name}!</p>
    </div>
  );
}

export default AdminDashboard;
