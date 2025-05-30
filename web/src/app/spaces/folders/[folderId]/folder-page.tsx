"use client"

import { Suspense } from "react";

import { useDataViewStore } from "@/zustand/providers/data-view-store-provider";

import { DataViews } from "@/components/custom/data/data-views";
import { CustomBreadcrumb } from "@/components/custom/custom-breadcrumb";
import { FoldersGridView } from "@/components/custom/data/grid/folders-grid-view";
import { FoldersListView } from "@/components/custom/data/list/folders-list-view";
import { Dropzone } from "@/components/custom/data/upload/dropzone";
import { GridViewSkeleton } from "@/components/custom/data/grid/grid-view-skeleton";
import { ListViewSkeleton } from "@/components/custom/data/list/list-view-skeleton";
import { CustomBreadcrumbSkeleton } from "@/components/custom/custom-breadcrumb-skeleton";

export function FolderPage({
    folderId,
}: {
    folderId: string
}) {
    const { view } = useDataViewStore(state => state);

    return (
        <div className="flex flex-col flex-1 gap-2">
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
        </div>
    );
}