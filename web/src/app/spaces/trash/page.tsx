"use client"

import { useDataViewStore } from "@/zustand/providers/data-view-store-provider";

import { DataViews } from "@/components/custom/data/data-views";
import { RootGridView } from "@/components/custom/data/grid/root-grid-view";
import { RootListView } from "@/components/custom/data/list/root-list-view";

const Trash = () => {
    const { view } = useDataViewStore(state => state);

    return (
        <div className="flex flex-col flex-1 gap-2">
            <section className="flex items-center justify-between px-6 pt-6">
                <span className="text-xl"> Trash </span>
                <DataViews />
            </section>
            <div className="flex items-center justify-between px-4 rounded-lg bg-zinc-900 h-14 mx-6 mt-2">
                <span className="text-sm text-zinc-300"> You cannot access or download files or folders in the trash. </span>
            </div>
            <main>
                <section className="p-6">
                    {view === "grid" && <RootGridView inaccessible />}
                    {view === "list" && <RootListView inaccessible />}
                </section>
            </main>
        </div>
    );
};

export default Trash;
