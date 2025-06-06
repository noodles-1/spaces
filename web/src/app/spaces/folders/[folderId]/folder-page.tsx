"use client"

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useDataViewStore } from "@/zustand/providers/data-view-store-provider";

import { DataViews } from "@/components/custom/data/data-views";
import { CustomBreadcrumb } from "@/components/custom/custom-breadcrumb";
import { FoldersGridView } from "@/components/custom/data/grid/folders-grid-view";
import { FoldersListView } from "@/components/custom/data/list/folders-list-view";
import { Dropzone } from "@/components/custom/data/upload/dropzone";
import { GridViewSkeleton } from "@/components/custom/data/grid/grid-view-skeleton";
import { ListViewSkeleton } from "@/components/custom/data/list/list-view-skeleton";
import { CustomBreadcrumbSkeleton } from "@/components/custom/custom-breadcrumb-skeleton";

import { fetcher } from "@/services/fetcher";
import { ResponseDto } from "@/dto/response-dto";

export function FolderPage({
    folderId,
}: {
    folderId: string
}) {
    const { view } = useDataViewStore(state => state);

    const { data: folderData } = useSuspenseQuery<ResponseDto<{ deleted: boolean }>>({
        queryKey: ["check-directory-deleted", folderId],
        queryFn: () => fetcher(`/storage/items/check-deleted/${folderId}`)
    });

    return (
        <div className="flex flex-col flex-1 gap-2">
            {folderData.data.deleted ?
                <section className="flex-1 flex flex-col gap-1 items-center justify-center">
                    <span className="text-2xl text-spaces-tertiary font-semibold"> Forbidden </span>
                    <div className="flex gap-1">
                        <span className="text-zinc-400 max-w-[30rem] text-center"> You cannot access this resource as it has either been deleted by the owner or you don&apos;t have sufficient permissions. </span>
                    </div>
                </section>
            :
                <>
                    <section className="flex items-center justify-between px-6 pt-6">
                        <Suspense fallback={<CustomBreadcrumbSkeleton />}>
                            <CustomBreadcrumb 
                                folderId={folderId}
                            />
                        </Suspense>
                        <DataViews />
                    </section>
                    <main className="relative flex flex-col flex-1">
                        <Dropzone />
                        <section className="flex-1 p-6">
                            <Suspense fallback={<GridViewSkeleton />}>
                                {view === "grid" && <FoldersGridView parentId={folderId} />}
                            </Suspense>
                            <Suspense fallback={<ListViewSkeleton />}>
                                {view === "list" && <FoldersListView parentId={folderId} />}
                            </Suspense>
                        </section>
                    </main>
                </>
            }
        </div>
    );
}