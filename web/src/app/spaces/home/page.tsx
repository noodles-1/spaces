"use client"

import { Suspense } from "react";

import { useDataViewStore } from "@/zustand/providers/data-view-store-provider";

import { DataViews } from "@/components/custom/data/data-views";
import { RootGridView } from "@/components/custom/data/grid/root-grid-view";
import { RootListView } from "@/components/custom/data/list/root-list-view";
import { Dropzone } from "@/components/custom/data/upload/dropzone";
import { GridViewSkeleton } from "@/components/custom/data/grid/grid-view-skeleton";
import { ListViewSkeleton } from "@/components/custom/data/list/list-view-skeleton";

const Home = () => {
    const { view } = useDataViewStore(state => state);

    return (
        <div className="flex flex-col flex-1 gap-2">
            <section className="flex items-center justify-between px-6 pt-6">
                <span className="text-xl"> Home </span>
                <DataViews />
            </section>
            <main className="relative flex-1">
                <Dropzone />
                <section className="p-6">
                    <Suspense fallback={<GridViewSkeleton />}>
                        {view === "grid" && <RootGridView />}
                    </Suspense>
                    <Suspense fallback={<ListViewSkeleton />}>
                        {view === "list" && <RootListView />}
                    </Suspense>
                </section>
            </main>
        </div>
    );
};

export default Home;
