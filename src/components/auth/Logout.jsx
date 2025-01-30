import axios from "axios";
import { Button } from "../ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" className="rounded-xl" onClick={handleLogout}>
          Logout
        </Button>
      </TooltipTrigger>
      <TooltipContent className="bg-slate-50">
        <p className="text-black">Log out from your account/session.</p>
      </TooltipContent>
    </Tooltip>
  );
};