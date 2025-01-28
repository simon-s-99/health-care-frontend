'use client';
import heartRateIcon from "@/public/heart-rate-icon.svg";
import doctorIcon from "@/public/doctor-icon.svg";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AuthContext } from "@/context/AuthContext";
import { RiCloseLargeFill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";

export default function NavBar() {
  const { authState } = useContext(AuthContext);
  const isAdmin = authState && authState.roles?.includes("Admin");
  const [isActive, setIsActive] = useState(false);
  const endContent = authState.isAuthenticated ? (
    <p>
      Welcome {authState.username}, logged in as {isAdmin ? "caregiver" : "patient"}
      {/* If user or admin, display "caregiver" or "patient" */}
    </p>
  ) : (
    <Button variant="secondary" className="rounded-xl">
      {/* Otherwise if not logged in, display a login button */}
      <Link href="/auth/login">Log in</Link>
    </Button>
  );

  return (
    <nav className="flex flex-row justify-between uppercase tracking-wider">
      <ul className="flex flex-row justify-between w-1/2 xl:w-1/4 *:p-2">
        <li className="z-10">
          <Link href="/">
            <Image
              className="min-w-[50px] min-h-[50px] hover:scale-110"
              src={isAdmin ? doctorIcon : heartRateIcon}
              alt="Navigation icon"
            />
          </Link>
        </li>
        <li className="sm:visible invisible my-2">
          <Link
            className="hover:text-blue-700"
            href={isAdmin ? "/schedule" : "/booking"}
          >
            {isAdmin ? "Schedule" : "Booking"}
          </Link>
        </li>
        <li className="sm:visible invisible my-2">
          <Link className="hover:text-blue-700" href="/dashboard">
            Dashboard
          </Link>
        </li>
        {/* Feedback button */}
        <li className="sm:visible invisible my-2">
          <Link className="hover:text-blue-700" href="/feedback">
            Submit feedback
          </Link>
        </li>
      </ul>

      <span className="sm:inline hidden m-2">{endContent}</span>
      <button
        className="sm:hidden inline z-10"
        onClick={() => setIsActive(!isActive)}
      >
        {isActive ? (
          <RiCloseLargeFill className="w-[50px] h-[50px]" />
        ) : (
          <RxHamburgerMenu className="w-[50px] h-[50px]" />
        )}
      </button>

      {isActive && (
        <ul className="bg-blue-400 absolute flex text-center flex-col w-full sm:hidden *:mt-10 pb-4">
          <li>
            <Link
              className="block w-full"
              href={isAdmin ? "/schedule" : "/booking"}
            >
              {isAdmin ? "Schedule" : "Booking"}
            </Link>
          </li>
          <li>
            <Link className="block w-full" href="/dashboard">
              Dashboard
            </Link>
          </li>
          <Link className="block w-full" href="/feedback">
            Submit your feedback
          </Link>
          <li>
            <span className="*:bg-transparent *:uppercase *:tracking-wider *:w-full *:text-yellow-300 *:hover:bg-transparent *:h-0">
              {endContent}
            </span>
          </li>
        </ul>
      )}
    </nav>
  );
}
