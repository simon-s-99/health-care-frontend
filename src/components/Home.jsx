import Logo from "../assets/health_care_logo.svg";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <img src={Logo} alt="Health Care Logo" className="h-64 mb-8" />
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/register">Register</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
