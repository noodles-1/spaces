"use client"

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useDataViewStore } from "@/zustand/providers/data-view-store-provider";
import { AxiosResponse } from "axios";

import { DataViews } from "@/components/custom/data/data-views";
import { RootGridView } from "@/components/custom/data/grid/root-grid-view";
import { RootListView } from "@/components/custom/data/list/root-list-view";
import { Dropzone } from "@/components/custom/data/upload/dropzone";

import axiosClient from "@/lib/axios-client";
import { ResponseDto } from "@/dto/response-dto";

const Home = () => {
    const { view } = useDataViewStore(state => state);
    const router = useRouter();

    const { data: authenticatedData } = useQuery<AxiosResponse<ResponseDto<{ authenticated: boolean }>>>({
        queryKey: ["current-user-authenticated"],
        queryFn: () => axiosClient.get("/user/users/me/authenticated")
    });

    if (!authenticatedData) {
        return null;
    }
    
    const authenticated = authenticatedData.data.data.authenticated;

    if (!authenticated) {
        router.push("/login");
    }

    return (
        <div className="flex flex-col flex-1 gap-2">
            <section className="flex items-center justify-between px-6 pt-6">
                <span className="text-xl"> Home </span>
                <DataViews />
            </section>
            <main className="relative flex-1">
                <Dropzone />
                <section className="p-6">
                    {view === "grid" && <RootGridView />}
                    {view === "list" && <RootListView />}
                </section>
            </main>
        </div>
    );
};

export default Home;
