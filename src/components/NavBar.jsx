import heartRateIcon from "../assets/heart-rate-icon.svg";
import doctorIcon from "../assets/doctor-icon.svg";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiCloseLargeFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import profileIcon from "../assets/profile-icon.jpg";
import Logout from "./Logout";

export default function NavBar() {
  const { authState, isLoading } = useAuth();
  const [isActive, setIsActive] = useState(false);

  const isAdmin = authState && authState.roles?.includes("Admin");
  const endContent = authState.isAuthenticated ? (
    <div className="flex items-center gap-2">
      <p>
        Welcome {authState.username}, logged in as{" "}
        {isAdmin ? "caregiver" : "patient"}
      </p>
      <Logout />
      {/* Profile Icon*/}
      {authState.isAuthenticated && (
        <NavLink to="/profile">
          <img
            src={profileIcon}
            alt="Profile icon"
            className="w-8 h-8 rounded-full border border-gray-300 hover:scale-110"
          />
        </NavLink>
      )}
    </div>
  ) : (
    <div className="flex gap-4">
      <Button variant="secondary" className="rounded-xl">
        <NavLink to="/register">Register</NavLink>
      </Button>
      <Button variant="secondary" className="rounded-xl">
        <NavLink to="/login">Log in</NavLink>
      </Button>
    </div>
  );

  if (isLoading) {
    return <h2>Loading...</h2>;
  }
  
  return (
    <nav className="flex flex-row justify-between uppercase tracking-wider">
      <ul className="flex flex-row justify-between w-1/2 xl:w-1/4 *:p-2">
        <li className="z-10">
          <NavLink to="/">
            <img
              className="min-w-[50px] min-h-[50px] hover:scale-110"
              src={isAdmin ? doctorIcon : heartRateIcon}
              alt="Navigation icon"
            />
          </NavLink>
        </li>
        <li className="sm:visible invisible my-2">
          <NavLink
            className="hover:text-blue-700"
            to={isAdmin ? "/schedule" : "/booking"}
          >
            {isAdmin ? "Schedule" : "Booking"}
          </NavLink>
        </li>
        <li className="sm:visible invisible my-2">
          <NavLink
            className="hover:text-blue-700"
            to={isAdmin ? "/dashboard/admin" : "/dashboard/user"}
          >
            Dashboard
          </NavLink>
        </li>
        {/* Feedback button */}
        <li className="sm:visible invisible my-2">
          <NavLink className="hover:text-blue-700" to="/feedback">
            Submit feedback
          </NavLink>
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
            <NavLink className="block w-full" to="/booking">
              Booking
            </NavLink>
          </li>
          <li>
            <NavLink className="block w-full" to={"/dashboard/user"}>
              Dashboard
            </NavLink>
          </li>
          <NavLink className="block w-full" to="/feedback">
            Submit your feedback
          </NavLink>
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
