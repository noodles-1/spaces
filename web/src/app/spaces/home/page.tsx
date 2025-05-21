"use client"

import { useDataViewStore } from "@/zustand/providers/data-view-store-provider";

import { DataViews } from "@/components/custom/data/data-views";
import { GridView } from "@/components/custom/data/grid/grid-view";
import { ListView } from "@/components/custom/data/list/list-view";
import { Dropzone } from "@/components/custom/data/upload/dropzone";

const Home = () => {
    const { view } = useDataViewStore(state => state);

    return (
        <div className="flex flex-col flex-1 gap-2">
            <section className="flex items-center justify-between px-6 pt-6">
                <span className="text-xl"> Home </span>
                <DataViews />
            </section>
            <main className="relative">
                <Dropzone />
                <section className="p-6">
                    {view === "grid" && <GridView />}
                    {view === "list" && <ListView />}
                </section>
            </main>
        </div>
    );
};

export default Home;
