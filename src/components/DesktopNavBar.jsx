import { useAuth } from "../hooks/useAuth";
import heartRateIcon from "../assets/heart-rate-icon.svg";
import doctorIcon from "../assets/doctor-icon.svg";
import { Button } from "./ui/button";

export default function DesktopNavbar({user}) {

  const isAdmin = user && user.roles.includes("Admin");

  const endContent = user ? (
    `Welcome ${user.name}, logged in as ${isAdmin ? caregiver : patient}`
  ) : (
    <Button variant="secondary" className="rounded-xl">
      <a href="/login">Log in</a>
    </Button>
  );

  return (
    <nav className="flex flex-row justify-between *:p-2">
      <ul className="flex flex-row justify-between w-1/4">
        <li>
          <a href="/">
            <img
              className=""
              src={isAdmin ? doctorIcon : heartRateIcon}
              height={50}
              width={50}
              alt="Navigation icon"
            />
          </a>
        </li>
        <li>
          <a href={isAdmin ? "/schedule" : "/booking"}>
            {isAdmin ? "Schedule" : "Booking"}
          </a>
        </li>
        <li>
          <a href="/dashboard">Dashboard</a>
        </li>
      </ul>
      <span>{endContent}</span>
      <Button></Button>
    </nav>
  );
}
