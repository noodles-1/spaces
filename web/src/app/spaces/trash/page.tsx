"use client"

import { TrashIcon } from "lucide-react";

import { useDataViewStore } from "@/zustand/providers/data-view-store-provider";

import { customToast } from "@/lib/custom/custom-toast";

import { Button } from "@/components/ui/button";

import { DataViews } from "@/components/custom/data/data-views";
import { GridView } from "@/components/custom/data/grid/grid-view";
import { ListView } from "@/components/custom/data/list/list-view";

const Trash = () => {
    const { view } = useDataViewStore(state => state);

    const handleEmptyTrash = () => {
        customToast({
            icon: <TrashIcon className="w-4 h-4" color="white"/>,
            message: "Trash has been emptied successfully"
        });
    };

    return (
        <div className="flex flex-col flex-1 gap-6">
            <section className="flex items-center justify-between">
                <span className="text-xl"> Trash </span>
                <DataViews />
            </section>
            <div className="flex items-center justify-between px-4 rounded-lg bg-zinc-900 h-14">
                <span className="text-sm text-zinc-300"> Items in trash will be deleted after 30 days. </span>
                <Button 
                    variant="link" 
                    className="text-[#81a7ff] cursor-pointer"
                    onClick={handleEmptyTrash}
                > 
                    Empty trash
                </Button>
            </div>
            <main>
                {view === "grid" && <GridView />}
                {view === "list" && <ListView />}
            </main>
        </div>
    );
};

export default Trash;
