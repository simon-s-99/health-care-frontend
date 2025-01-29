import { FaHeartbeat } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiCloseLargeFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import Logout from "./auth/Logout";

import Profile from "./profile/Profile";

import { useToast } from "@/hooks/use-toast"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { convertToObject } from "typescript";


export default function NavBar() {
  const { authState } = useAuth();
  const isAdmin = authState && authState.roles?.includes("Admin");
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (authState.isAuthenticated) {
      toast({
        title: `Welcome ${authState.username}!`,
        description: `Logged in as ${isAdmin ? "caregiver" : "patient"}.`,
        duration: 4000, // how long the toast should be on-screen in ms
      })
    }
  }, [authState.isAuthenticated])

  const endContent = authState.isAuthenticated ? (
    <div className="flex items-center gap-2">
      {/* logout button */}
      <Logout />

      {/* Profile Icon*/}
      {authState.isAuthenticated && (
        <Sheet>
          <SheetTrigger>
            <CgProfile className="w-8 h-8 hover:scale-105" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              {/* TODO - move tabs from profile to sheettitle instead */}
              <SheetTitle></SheetTitle>
              <SheetDescription>
                <Profile />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </div>
  ) : (
    <div className="flex gap-x-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="rounded-xl" asChild>
            <NavLink to="/register">Register</NavLink>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-100">
          <p className="text-black">Navigate to register page.</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="rounded-xl" asChild>
            <NavLink to="/login">Log in</NavLink>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-100">
          <p className="text-black">Navigate to login page.</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <nav className="flex flex-row justify-between uppercase tracking-wider ml-2 my-1">
      <NavigationMenu>
        <NavigationMenuList className="gap-x-2">
          {/* List of nav-links styled with shadcn/ui */}
          <NavigationMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink to="/">
                  {isAdmin ?
                    <FaUserDoctor alt="Doctor icon with navigation when clicked"
                      className="min-w-16 min-h-16 hover:scale-105" /> :
                    <FaHeartbeat alt="Heart with heartbeat icon with navigation when clicked"
                      className="min-w-16 min-h-16 hover:scale-105 text-red-600" />}
                </NavLink>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-100">
              <p className="text-black">Navigate back to home-page.</p>
              </TooltipContent>
            </Tooltip>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="rounded-xl" asChild>
                  <NavLink className={"rounded-md"} to={isAdmin ? "/schedule" : "/booking"}>
                    {isAdmin ? "Schedule" : "Booking"}
                  </NavLink>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-100">
              <p className="text-black">Navigate to {isAdmin ? "schedule" : "booking"} page.</p>
              </TooltipContent>
            </Tooltip>
          </NavigationMenuItem>


          <Tooltip>
            <TooltipTrigger asChild>
              <NavigationMenuItem>
                <Button variant="ghost" className="rounded-xl" asChild>
                  <NavLink className="hover:text-blue-700" to="/dashboard">
                    Dashboard
                  </NavLink>
                </Button>
              </NavigationMenuItem>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-100">
            <p className="text-black">Navigate to dashboard.</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <NavigationMenuItem>
                <Button variant="ghost" className="rounded-xl" asChild>
                  <NavLink className="hover:text-blue-700" to="/feedback">
                    Submit feedback
                  </NavLink>
                </Button>
              </NavigationMenuItem>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-100">
            <p className="text-black">Navigate to feedback/review page.</p>
            </TooltipContent>
          </Tooltip>
        </NavigationMenuList>
      </NavigationMenu>

      <span className="my-auto ml-2 mr-4">{endContent}</span>

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

    </nav >
  );
}
