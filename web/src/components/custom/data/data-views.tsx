'use client'

import { useState } from "react";

import { AlignJustify, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DataViews() {
    const [view, setView] = useState<"grid" | "list">("list");

    return (
        <div>
            <Button 
                variant="outline" 
                onClick={() => setView("list")}
                className={`hover:cursor-pointer rounded-r-none
                    ${view === "list" && "text-[#96b2ff]"}`}
            > 
                <AlignJustify /> 
            </Button>
            <Button 
                variant="outline" 
                onClick={() => setView("grid")}
                className={`hover:cursor-pointer rounded-l-none
                    ${view === "grid" && "text-[#96b2ff]"}`}
            > 
                <LayoutGrid /> 
            </Button>
        </div>
    );
}