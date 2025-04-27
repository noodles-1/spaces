"use client"

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { CircleX } from "lucide-react";

import { handleRegister } from "@/actions/auth";
import { customToast } from "@/lib/custom/utils";

export default function AuthPage() {
    const router = useRouter();
    const { provider } = useParams<{ provider: string }>();

    const { data: session, status } = useSession();

    const popupCenter = (url: string, title: string) => {
        const dualScreenLeft = window.screenLeft ?? window.screenX;
        const dualScreenTop = window.screenTop ?? window.screenY;
    
        const width =
            window.innerWidth ?? 
            document.documentElement.clientWidth ?? 
            screen.width;
    
        const height =
            window.innerHeight ??
            document.documentElement.clientHeight ??
            screen.height;
    
        const systemZoom = width / window.screen.availWidth;
    
        const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
        const top = (height - 550) / 2 / systemZoom + dualScreenTop;
    
        const newWindow = window.open(
            url,
            title,
            `width=${800 / systemZoom},height=${750 / systemZoom
            },top=${top},left=${left}`
        );
    
        newWindow?.focus();
    };

    const availableProviders = ["github", "discord"];
    const providerExists = availableProviders.includes(provider);

    const handleAuthenticate = async () => {
        if (session && session.user && session.user.email) {
            const userExists = await handleRegister(session.user.email);

            if (userExists) {
                router.push("/spaces/home");                
            }
            else {
                router.push("/login/auth/setup");
            }
        }
    };

    if (status === "authenticated" && session.user && session.user.email) {
        try {
            handleAuthenticate();
        }
        catch (err) {
            customToast({
                icon: <CircleX className="w-4 h-4" fill="white" />,
                message: err as string
            });
        }
    }
    else if (status === "unauthenticated" && providerExists) {
        popupCenter(`/login/auth-window/${provider}`, "Log-in to spaces");
    }

    return (
        <main className="relative flex items-center justify-center flex-1 h-screen bg-zinc-800">
            <p className="absolute top-6 left-6 w-fit bg-[linear-gradient(to_right,#81a7ff,#abc4ff,#c3adff)] bg-[length:200%_100%] bg-clip-text bg-left text-3xl font-bold text-transparent transition-all duration-500 ease-in-out hover:bg-right">
                spaces
            </p>
                {providerExists ? (
                    session ? (
                        session.user && (
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-2xl font-semibold"> Successfully logged in! </span>
                                <span className="text-lg text-[#abc4ff]"> Redirecting to the home page... </span>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl font-semibold"> Authentication ongoing... </span>
                            <span className="text-lg text-[#abc4ff]"> Kindly complete the authentication in order to proceed. </span>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl font-semibold"> Invalid provider </span>
                        <span className="text-lg"> Go back to <Link href="/login" className="text-[#abc4ff] hover:underline"> login page </Link> to re-authenticate. </span>
                    </div>
                )}
        </main>
    );
}