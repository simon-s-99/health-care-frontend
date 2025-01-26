'use client';
import { useSession } from "next-auth/react";

export default function ExampleClientSideUseAuth() {
    const session = useSession();

    return (
        <div className="p-2 px-3 m-2 bg-gray-300 rounded-md">
            <p>
                Client component, status == {session.status}
            </p>
        </div>
    )
}
