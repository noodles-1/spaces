"use client"

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function AuthWindowPage() {
    const { provider } = useParams<{ provider: string }>();

    const { data: session, status } = useSession();

    useEffect(() => {
        if (status !== "loading" && !session)
            void signIn(provider);
        if (session)
            window.close();
    }, [session, status, provider]);

    return (
        <div className="w-screen h-screen bg-zinc-800" />
    );
}