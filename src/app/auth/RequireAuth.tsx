import useAuth from "@/hooks/useAuth";
import NoAuthRedirectTo from "@/app/auth/NoAuthRedirectTo";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const user = useAuth();

    return (
        <>
            {
                user.isAuthenticated ?
                    <>
                        {children}
                    </>
                    :
                    <NoAuthRedirectTo redirectUrl={"/"} />
            }
        </>
    )
}
