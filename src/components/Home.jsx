import Logo from "../assets/health_care_logo.svg";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"

export default function Home() {
  return (
    <>
      <div>
        <img src={Logo} />
        <h1>Health Care Appointment App</h1>
        <button>
          <Link className="link" to="/login">
            Login
          </Link>
        </button>
      </div>
    </>
  );
}
