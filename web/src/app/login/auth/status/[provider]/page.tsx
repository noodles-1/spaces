"use client"

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { AxiosError } from "axios";

import { loginUser } from "@/services/user";
import { ResponseDto } from "@/dto/response-dto";
import { useParams, useSearchParams } from "next/navigation";

export default function AuthPage() {
    const { provider } = useParams<{ provider: string }>();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const [errorMessage, setErrorMessage] = useState<string>("");

    const queryClient = useQueryClient();

    const loginUserMutation = useMutation({
        mutationFn: loginUser
    });

    useEffect(() => {
        async function authenticate() {
            if (!code)
                return;

            let message;
    
            try {
                await loginUserMutation.mutateAsync({
                    code,
                    provider
                });

                queryClient.invalidateQueries({
                    queryKey: ["current-user"]
                });

                message = "auth-success";
            }
            catch (error) {
                const axiosError = error as AxiosError;
                const data = axiosError.response?.data as ResponseDto;
                console.log(axiosError);
                setErrorMessage(data.message);
                message = "auth-error";
            }

            window.opener?.postMessage(
                { type: message },
                window.location.origin
            );
        }

        authenticate();
    }, [code]);

    return (
        <main className="relative flex items-center justify-center flex-1 h-screen bg-zinc-800">
            <p className="absolute top-6 left-6 w-fit bg-[linear-gradient(to_right,#81a7ff,#abc4ff,#c3adff)] bg-[length:200%_100%] bg-clip-text bg-left text-3xl font-bold text-transparent transition-all duration-500 ease-in-out hover:bg-right">
                spaces
            </p>
            {loginUserMutation.isError ?
                <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl font-semibold text-destructive"> Login failed! </span>
                    <span className="text-lg"> {errorMessage} </span>
                </div>
            :
                <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl font-semibold"> Logging you in... </span>
                    <span className="text-lg text-[#abc4ff]"> This window will close automatically once you are logged in. </span>
                </div>
            }
        </main>
    );
}