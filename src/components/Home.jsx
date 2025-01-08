import Logo from "../assets/health_care_logo.svg";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button.jsx"
export default function Home() {
  return (
    <>
      <div>
        <Button variant={buttonVariants} >Test</Button>
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
