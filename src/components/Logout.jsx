import axios from "axios";
import { Button } from "./ui/button";

export default function Logout() {
  const handleLogout = () => {
    axios
      .post(
        "http://localhost:5148/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        window.location.href = "/home";
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <Button variant="secondary" className="rounded-xl" onClick={handleLogout}>
      Logout
    </Button>
  );
};