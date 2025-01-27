'use client';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

export default function NoAuthRedirectTo({ redirectUrl }: { redirectUrl: string }) {
    const router = useRouter();

    useEffect(() => {
        alert("You are not Authenticated");
        router.push(redirectUrl);
    }, [redirectUrl, router])

    return (
        <></>
    )
}
