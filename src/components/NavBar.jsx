import { useAuth } from "../hooks/useAuth";
import heartRateIcon from "../assets/heart-rate-icon.svg";
import doctorIcon from "../assets/doctor-icon.svg";
import { Button } from "./ui/button";
import DesktopNavbar from "./DesktopNavBar";

export default function NavBar() {

    const {
        authState: { user },
      } = useAuth();

  return (
    <DesktopNavbar />
  );
}
