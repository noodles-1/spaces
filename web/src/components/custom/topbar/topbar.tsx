"use client"

import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { ProfileButton } from "@/components/custom/topbar/profile-button";
import { PublicTopbar } from "@/components/custom/topbar/public/topbar";
import { PublicLoginButton } from "@/components/custom/topbar/public/login-button";
import { TopbarSkeleton } from "@/components/custom/topbar/topbar-skeleton";

import { ResponseDto } from "@/dto/response-dto";
import axiosClient from "@/lib/axios-client";

export function Topbar() {
    const { data: authenticatedData } = useQuery<AxiosResponse<ResponseDto<{ authenticated: boolean }>>>({
        queryKey: ["current-user-authenticated"],
        queryFn: () => axiosClient.get("/user/users/me/authenticated")
    });

    if (!authenticatedData) {
        return <TopbarSkeleton />;
    }

    const authenticated = authenticatedData.data.data.authenticated;

    if (!authenticated) {
        return (
            <>
                <PublicTopbar />
                <PublicLoginButton />
            </>
        );
    }

    return (
        <>
            <div className="grow text-center">
                Welcome to spaces. Manage your cloud storage for free.
            </div>
            <ProfileButton />
        </>
    );
}
