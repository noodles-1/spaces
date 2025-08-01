"use client"

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { AxiosError } from "axios";
import axiosClient from "@/lib/axios-client";

import { Button } from "@/components/ui/button";
import { ResponseDto } from "@/dto/response-dto";

import { DISCORD_LOGIN, GITHUB_LOGIN } from "@/constants/provider-url";
import { User } from "@/types/response/user-type";

export default function LoginPage() {
    const router = useRouter();

    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const tryRedirect = async () => {
            try {
                const response = await axiosClient.get("/user/users/me");
                const responseData: ResponseDto<User> = response.data;

                if (!responseData.data?.user.setupDone) {
                    router.push("/login/auth/setup");
                }
                else {
                    router.push("/spaces/home");
                }
            }
            catch (error) {
                const axiosError = error as AxiosError;
                const data = axiosError.response?.data as ResponseDto;
                console.log(data);
            }
        };

        tryRedirect();
    }, []);

    const handleLogin = (url: string, title: string) => {
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
            `width=${800 / systemZoom},height=${750 / systemZoom},top=${top},left=${left}`
        );

        const handleMessage = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin)
                return;

            if (event.data?.type === "auth-success") {
                const response = await axiosClient.get("/user/users/me");
                const responseData: ResponseDto<User> = response.data;

                if (responseData.data?.user.setupDone) {
                    router.push("/spaces/home");
                }
                else {
                    router.push("/login/auth/setup");
                }
            }
            else {
                setError(true);
            }

            newWindow?.close();
            window.removeEventListener("message", handleMessage);
        };

        setAuthenticating(true);
        window.addEventListener("message", handleMessage);
        newWindow?.focus();
    };

    return (
        <>
            {authenticating ? (
                error ? (
                    <main className="relative flex items-center justify-center flex-1 h-screen bg-zinc-800">
                        <p className="absolute top-6 left-6 w-fit bg-[linear-gradient(to_right,#81a7ff,#abc4ff,#c3adff)] bg-[length:200%_100%] bg-clip-text bg-left text-3xl font-bold text-transparent transition-all duration-500 ease-in-out hover:bg-right">
                            spaces
                        </p>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl font-semibold text-destructive"> Log-in failed! </span>
                            <span className="text-lg"> Something went wrong with the authentication. </span>
                        </div>
                    </main>
                ) : (
                    <main className="relative flex items-center justify-center flex-1 h-screen bg-zinc-800">
                        <p className="absolute top-6 left-6 w-fit bg-[linear-gradient(to_right,#81a7ff,#abc4ff,#c3adff)] bg-[length:200%_100%] bg-clip-text bg-left text-3xl font-bold text-transparent transition-all duration-500 ease-in-out hover:bg-right">
                            spaces
                        </p>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl font-semibold"> Authentication ongoing... </span>
                            <span className="text-lg text-[#abc4ff]"> Kindly finish the authentication in the new window. </span>
                        </div>
                    </main>
                )
            ) : (
                <main className="flex flex-1">
                    <section className="flex items-center justify-center flex-1">
                        <div className="w-[80%] flex flex-col">
                            <p className="w-fit bg-[linear-gradient(to_right,#81a7ff,#abc4ff,#c3adff)] bg-[length:200%_100%] bg-clip-text bg-right text-[5rem] lg:text-[6rem] font-bold text-transparent transition-all duration-500 ease-in-out hover:bg-left">
                                spaces
                            </p>
                            <span className="text-2xl"> Your personal cloud storage </span>
                        </div>
                    </section>
                    <section className="bg-zinc-800 w-[400px]">
                        <div className="mx-auto w-[80%] mt-[160px] flex flex-col items-center gap-4">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-xl font-semibold"> Log-in to spaces </span>
                                <span className="text-sm text-[#abc4ff]"> Connect an account below to continue </span>
                            </div>
                            <Button 
                                variant="outline"
                                onClick={() => handleLogin(GITHUB_LOGIN, "Login to Spaces with GitHub")}
                                className="flex justify-start w-full rounded-lg cursor-pointer h-14"
                            >
                                <div className="flex items-center w-full gap-4 mx-2">
                                    <svg fill="white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                                    <span> Continue with GitHub </span>
                                </div>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleLogin(DISCORD_LOGIN, "Login to Spaces with Discord")}
                                className="flex justify-start w-full rounded-lg cursor-pointer h-14" 
                            >
                                <div className="flex items-center w-full gap-4 mx-2">
                                    <svg fill="white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                                    <span> Continue with Discord </span>
                                </div>
                            </Button>
                        </div>
                    </section>
                </main>
            )}
        </>
    );
}