"use client"

import { Suspense } from "react";

import { useDataViewStore } from "@/zustand/providers/data-view-store-provider";

import { DataViews } from "@/components/custom/data/data-views";
import { GridViewSkeleton } from "@/components/custom/data/grid/grid-view-skeleton";
import { RootGridView } from "@/components/custom/data/grid/root-grid-view";
import { ListViewSkeleton } from "@/components/custom/data/list/list-view-skeleton";
import { RootListView } from "@/components/custom/data/list/root-list-view";

const Starred = () => {
    const { view } = useDataViewStore(state => state);

    return (
        <div className="flex flex-1 flex-col gap-2">
            <section className="flex items-center justify-between px-6 pt-6">
                <span className="text-xl"> Starred </span>
                <DataViews />
            </section>
            <main>
                <section className="p-6">
                    <Suspense fallback={<GridViewSkeleton />}>
                        {view === "grid" && <RootGridView starred />}
                    </Suspense>
                    <Suspense fallback={<ListViewSkeleton />}>
                        {view === "list" && <RootListView starred />}
                    </Suspense>
                </section>
            </main>
        </div>
    );
};

export default Starred;
