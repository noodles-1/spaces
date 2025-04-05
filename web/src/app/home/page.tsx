'use client'

import { useDataViewStore } from "@/zustand/providers/data-view-store-provider";

import { DataViews } from "@/components/custom/data/data-views";
import { GridView } from "@/components/custom/data/grid/grid-view";

const Home = () => {
    const { view } = useDataViewStore(state => state);

    return (
        <div className="flex-1 flex flex-col gap-6">
            <section className="flex justify-between items-center">
                <span className="text-xl"> Home </span>
                <DataViews />
            </section>
            <main>
                {view === "grid" && <GridView />}
            </main>
        </div>
    );
}
 
export default Home;