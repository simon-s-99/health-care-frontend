'use client';
import NoAuthRedirectTo from "@/app/auth/NoAuthRedirectTo";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const { authState } = useContext(AuthContext);

    return (
        <>
            {
                authState.isAuthenticated ?
                    <>
                        {children}
                    </>
                    :
                    <NoAuthRedirectTo redirectUrl={"/"} />
            }
        </>
    )
}
