"use client"

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";

import { AxiosResponse } from "axios";
import axiosClient from "@/lib/axios-client";

import { useDataViewStore } from "@/zustand/providers/data-view-store-provider";

import { DataViews } from "@/components/custom/data/data-views";
import { CustomBreadcrumb } from "@/components/custom/breadcrumb/custom-breadcrumb";
import { FoldersGridView } from "@/components/custom/data/grid/folders-grid-view";
import { FoldersListView } from "@/components/custom/data/list/folders-list-view";
import { Dropzone } from "@/components/custom/data/upload/dropzone";
import { GridViewSkeleton } from "@/components/custom/data/grid/grid-view-skeleton";
import { ListViewSkeleton } from "@/components/custom/data/list/list-view-skeleton";

import { ResponseDto } from "@/dto/response-dto";
import { UserPermission } from "@/types/user-permission-type";
import { User } from "@/types/response/user-type";
import { PublicCustomBreadcrumb } from "@/components/custom/breadcrumb/public/custom-breadcrumb";

export function FolderPage({
    folderId,
}: {
    folderId: string
}) {
    const { view } = useDataViewStore(state => state);

    const { data: deletedData } = useQuery<AxiosResponse<ResponseDto<{ deleted: boolean }>>>({
        queryKey: ["check-directory-deleted", folderId],
        queryFn: () => axiosClient.get(`/storage/items/public/check-deleted/${folderId}`)
    });

    const { data: ownerUserIdData } = useQuery<AxiosResponse<ResponseDto<{ ownerUserId: string | null }>>>({
        queryKey: ["item-owner", folderId],
        queryFn: () => axiosClient.get(`/storage/items/public/owner-user-id/${folderId}`)
    });

    const { data: permissionData } = useQuery<AxiosResponse<ResponseDto<{ permission: UserPermission | null }>>>({
        queryKey: ["current-user-permission"],
        queryFn: () => axiosClient.get(`/storage/permissions/public/permission/${folderId}`)
    });

    const { data: userData } = useQuery<AxiosResponse<ResponseDto<User | { user: null }>>>({
        queryKey: ["current-user"],
        queryFn: () => axiosClient.get("/user/users/me")
    });

    if (!(deletedData && permissionData && userData && ownerUserIdData)) {
        return null;
    }

    const deleted = deletedData.data.data.deleted;
    const ownerUserId = ownerUserIdData.data.data.ownerUserId;
    const permission = permissionData.data.data.permission;
    const user = userData.data.data.user;

    const hasPermission = ((user && ownerUserId) && user.id === ownerUserId) || permission !== null;

    if (deleted || !hasPermission) {
        return (
            <section className="flex-1 flex flex-col gap-1 items-center justify-center">
                <span className="text-2xl text-spaces-tertiary font-semibold"> Forbidden </span>
                <div className="flex gap-1">
                    <span className="text-zinc-400 max-w-[30rem] text-center"> You cannot access this resource as it has either been deleted by the owner or you don&apos;t have sufficient permissions. </span>
                </div>
            </section>
        );
    }

    return (
        <div className="flex flex-col flex-1 gap-2">
            <section className="flex items-center justify-between px-6 pt-6">
                {(user && user.id === ownerUserId) ?
                    <CustomBreadcrumb folderId={folderId} />
                :
                    (permission &&
                        <PublicCustomBreadcrumb folderId={folderId} permission={permission} />
                    )
                }
                <DataViews />
            </section>
            <main className="relative flex flex-col flex-1">
                <Dropzone />
                <section className="flex flex-col flex-1 p-6">
                    <Suspense fallback={<GridViewSkeleton />}>
                        {view === "grid" && <FoldersGridView parentId={folderId} />}
                    </Suspense>
                    <Suspense fallback={<ListViewSkeleton />}>
                        {view === "list" && <FoldersListView parentId={folderId} />}
                    </Suspense>
                </section>
            </main>
        </div>
    );
}