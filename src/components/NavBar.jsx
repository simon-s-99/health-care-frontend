import { FaHeartbeat } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiCloseLargeFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import Logout from "./auth/Logout";

import Profile from "./profile/Profile";

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
  TooltipProvider,
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


export default function NavBar() {
  const { authState } = useAuth();
  const isAdmin = authState && authState.roles?.includes("Admin");
  const [isActive, setIsActive] = useState(false);
  const endContent = authState.isAuthenticated ? (
    <div className="flex items-center gap-2">
      <p>
        Welcome {authState.username}, logged in as{" "}
        {isAdmin ? "caregiver" : "patient"}
      </p>
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
    <div className="flex gap-4">
      <Button variant="secondary" className="rounded-xl">
        <NavLink to="/register">Register</NavLink>
      </Button>
      <Button variant="secondary" className="rounded-xl">
        <NavLink to="/login">Log in</NavLink>
      </Button>
    </div>
  );

  return (
    <nav className="flex flex-row justify-between uppercase tracking-wider">

      <TooltipProvider>
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
                <TooltipContent>
                  <p>Navigate back to home-page.</p>
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
                <TooltipContent>
                  <p>Navigate to {isAdmin ? "schedule" : "booking"} page.</p>
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
              <TooltipContent>
                <p>Navigate to dashboard.</p>
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
              <TooltipContent>
                <p>Navigate to feedback/review page.</p>
              </TooltipContent>
            </Tooltip>
          </NavigationMenuList>
        </NavigationMenu>

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
      </TooltipProvider>
    </nav >
  );
}
