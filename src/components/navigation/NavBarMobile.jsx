import { FaHeartbeat } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiCloseLargeFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import Logout from "../auth/Logout";

import Profile from "../profile/Profile";

import { useToast } from "@/hooks/use-toast"

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export default function NavBarMobile() {
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

    return (
        <div className="flex flex-col">
            <div className="flex flex-row flex-wrap justify-between">
                <NavLink to="/" className="ml-2 mt-2">
                    {isAdmin ?
                        <FaUserDoctor alt="Doctor icon with navigation when clicked"
                            className="min-w-16 min-h-16 hover:scale-105" /> :
                        <FaHeartbeat alt="Heart with heartbeat icon with navigation when clicked"
                            className="min-w-16 min-h-16 hover:scale-105 text-red-600" />}
                </NavLink>

                {/* hamburger menu button */}
                <button
                    className="md:hidden mr-2 mt-2"
                    onClick={() => setIsActive(!isActive)}
                >
                    {isActive ? (
                        <RiCloseLargeFill className="w-[50px] h-[50px]" />
                    ) : (
                        <RxHamburgerMenu className="w-[50px] h-[50px]" />
                    )}
                </button>
            </div>

            <NavigationMenu className="flex flex-col mx-auto">
                {isActive &&
                    <NavigationMenuList className="flex flex-col">
                        {/* List of nav-links styled with shadcn/ui */}

                        <NavigationMenuItem>
                            <Button variant="ghost" className="rounded-xl" asChild>
                                <NavLink className={"rounded-md"} to={isAdmin ? "/booking/admin" : "/booking/user"}>
                                    {isAdmin ? "Schedule" : "Booking"}
                                </NavLink>
                            </Button>
                        </NavigationMenuItem>


                        <NavigationMenuItem>
                            <Button variant="ghost" className="rounded-xl" asChild>
                                <NavLink className="hover:text-blue-700" to="/dashboard">
                                    Dashboard
                                </NavLink>
                            </Button>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Button variant="ghost" className="rounded-xl" asChild>
                                <NavLink className="hover:text-blue-700" to="/feedback">
                                    Submit feedback
                                </NavLink>
                            </Button>
                        </NavigationMenuItem>

                        <>
                            {authState.isAuthenticated ?
                                <div className="flex flex-col items-center gap-2">
                                    {/* logout button */}
                                    <Logout />

                                    {/* Profile Icon*/}
                                    <Sheet>
                                        <SheetTrigger className="flex flex-row items-center mb-2">
                                            <CgProfile className="w-8 h-8 hover:scale-105" />
                                            <p className="ml-2">Profile</p>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetTitle>
                                                {/* TODO - Add content here for accessability */}
                                            </SheetTitle>
                                            <SheetDescription>
                                                {/* TODO - Add content here for accessability */}
                                            </SheetDescription>
                                            <Profile />
                                        </SheetContent>
                                    </Sheet>
                                </div>
                                :
                                <div className="flex flex-col">
                                    <Button variant="ghost" className="rounded-xl" asChild>
                                        <NavLink to="/register">Register</NavLink>
                                    </Button>
                                    <Button variant="ghost" className="rounded-xl" asChild>
                                        <NavLink to="/login">Log in</NavLink>
                                    </Button>
                                </div>
                            }
                        </>

                    </NavigationMenuList>
                }
            </NavigationMenu>
        </div >
    );
}
