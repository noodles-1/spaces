"use client"

import { AlignJustify, LayoutGrid } from "lucide-react";

import { useDataViewStore } from "@/zustand/providers/data-view-store-provider";

import { Button } from "@/components/ui/button";

export function DataViews() {
    const { view, setGridView, setListView } = useDataViewStore(
        (state) => state,
    );

    return (
        <div>
            <Button
                variant="outline"
                onClick={setListView}
                className={`rounded-r-none hover:cursor-pointer ${view === "list" && "text-[#96b2ff]"}`}
            >
                <AlignJustify />
            </Button>
            <Button
                variant="outline"
                onClick={setGridView}
                className={`rounded-l-none hover:cursor-pointer ${view === "grid" && "text-[#96b2ff]"}`}
            >
                <LayoutGrid />
            </Button>
        </div>
    );
}
