"use client"

import { useDataViewStore } from "@/zustand/providers/data-view-store-provider";

import { DataViews } from "@/components/custom/data/data-views";
import { RootGridView } from "@/components/custom/data/grid/root-grid-view";
import { RootListView } from "@/components/custom/data/list/root-list-view";

const Shared = () => {
    const { view } = useDataViewStore(state => state);

    return (
        <div className="flex flex-1 flex-col gap-2">
            <section className="flex items-center justify-between px-6 pt-6">
                <span className="text-xl"> Shared </span>
                <DataViews />
            </section>
            <main>
                <section className="p-6">
                    {view === "grid" && <RootGridView shared />}
                    {view === "list" && <RootListView shared />}
                </section>
            </main>
        </div>
    );
};

export default Shared;
