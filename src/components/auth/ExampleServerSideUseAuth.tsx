import { auth } from "@/auth";

export default async function ExampleServerSideUseAuth() {
    const session = await auth();

    return (
        <div className="p-2 px-3 m-2 bg-gray-300 rounded-md">
            <p>
                Server component, status ==
                {session?.user ? <span> Authenticated</span> : <span> Unauthenticated</span>}
            </p>
            <p>
                Session info == {session?.user?.id} {session?.user?.email} {session?.user?.name} {session?.expires}
            </p>
            <p>
                {session?.user.id}
                {/* {session?.user.roles[0]} + {session?.user.userId} */}
            </p>
        </div>
    )
}
