import Image from "next/image";
import Logo from "@/public/health_care_logo.svg";
import useAuth from "@/hooks/useAuth";

export default function AdminDashboard() {
  const user = useAuth();

  return (
    <div>
      <Image alt="Health Care company logo" src={Logo} />
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.username}!</p>
    </div>
  );
}
