'use client';
import Image from "next/image";
import Logo from "@/public/health_care_logo.svg";
import { useContext } from "react";
import { AuthContext } from "@/app/AuthProvider";

export default function UserDashboard() {
  const { authState } = useContext(AuthContext);

  return (
    <div>
      <Image alt="Health Care company logo" src={Logo} />
      <h2>User Dashboard</h2>
      <p>Welcome, {authState.username}!</p>
    </div>
  );
}
