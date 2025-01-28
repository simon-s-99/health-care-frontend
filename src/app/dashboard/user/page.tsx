import Image from "next/image";
import Logo from "@/public/health_care_logo.svg";
import useAuth from "@/hooks/useAuth";

export default function UserDashboard() {
  const user = useAuth();

  return (
    <div>
      <Image alt="Health Care company logo" src={Logo} />
      <h2>User Dashboard</h2>
      <p>Welcome, {user.username}!</p>
    </div>
  );
}