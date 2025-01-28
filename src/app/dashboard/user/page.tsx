'use client';
import Image from "next/image";
import Logo from "@/public/health_care_logo.svg";
import { useContext } from "react";
import { AuthContext } from "@/app/AuthProvider";
import RequireAuth from "@/app/auth/RequireAuth";
import RequireRoles from "@/app/auth/RequireRoles";

export default function UserDashboard() {
  const { authState } = useContext(AuthContext);

  return (
    <RequireAuth>
      <RequireRoles requiredRoles={["User"]}>
        <Image alt="Health Care company logo" src={Logo} />
        <h2>User Dashboard</h2>
        <p>Welcome, {authState.username}!</p>
      </RequireRoles>
    </RequireAuth>
  );
}
