import Image from "next/image";
import Logo from "../assets/health_care_logo.svg";
import { useSession } from "next-auth/react";

export default function UserDashboard() {
    const session = useSession();

  return (
    <div>
      <Image alt="Health Care company logo" src={Logo} />
      <h2>User Dashboard</h2>
      <p>Welcome, {session.data?.user?.name}!</p>
    </div>
  );
}