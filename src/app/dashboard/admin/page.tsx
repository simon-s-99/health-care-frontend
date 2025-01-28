'use client';
import Image from "next/image";
import Logo from "@/public/health_care_logo.svg";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function AdminDashboard() {
  const { authState } = useContext(AuthContext);

  return (
    <div>
      <Image alt="Health Care company logo" src={Logo} />
      <h2>Admin Dashboard</h2>
      <p>Welcome, {authState.username}!</p>
    </div>
  );
}
