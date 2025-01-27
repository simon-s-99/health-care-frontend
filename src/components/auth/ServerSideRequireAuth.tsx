import { auth } from "@/auth";
import NoAuthRedirectTo from "./NoAuthRedirectTo";
//import { useRouter } from "next/router";

export default async function ServerSideRequireAuth({ children }: { children: React.ReactNode }) {
    const session = await auth();
    //const router = useRouter();

    return (
        <>
            {
                session?.user ?
                <>
                    {children}
                </>
                :
                <NoAuthRedirectTo redirectUrl={"/"} />
            }
        </>
    )
}
