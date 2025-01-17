import heartRateIcon from "../assets/heart-rate-icon.svg";
import doctorIcon from "../assets/doctor-icon.svg";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiCloseLargeFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";


export default function NavBar() {
  const {
    authState: { user },
  } = useAuth();
  const isAdmin = user && user.roles.includes("Admin");
  const [isActive, setIsActive] = useState(false);
  const endContent = user ? (
    <p>
      Welcome {user.name}, logged in as {isAdmin ? "caregiver" : "patient"} {/* If user or admin, display "caregiver" or "patient" */}
    </p>
  ) : (
    <Button variant="secondary" className="rounded-xl"> {/* Otherwise if not logged in, display a login button */}
      <NavLink to="/login">Log in</NavLink>
    </Button>
  );endContent

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
          <NavLink className="hover:text-blue-700" to="/dashboard">
            Dashboard
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
            <NavLink
              className="block w-full"
              to={isAdmin ? "/schedule" : "/booking"}
            >
              {isAdmin ? "Schedule" : "Booking"}
            </NavLink>
          </li>
          <li>
            <NavLink className="block w-full" to="/dashboard">
              Dashboard
            </NavLink>
          </li>
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
