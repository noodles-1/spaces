import React from "react";

import { useDroppable } from "@dnd-kit/core";

import { File } from "@/types/file-type";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

export function DroppableFolderFile({ 
    file,
} : { 
    file: File
}) {
    const { setNodeRef } = useDroppable({
        id: file.name
    });

    return (
        <div 
            ref={setNodeRef}
            className="relative h-14 w-[230px] transition-all rounded-lg hover:bg-zinc-600 hover:ring-2 hover:ring-gray-300 hover:ring-inset"
        >
            <Button
                variant="outline"
                className="w-full h-full p-0 rounded-xl"
            >
                <section className="flex items-center justify-between w-full h-full mx-4">
                    <div className="flex items-center w-full h-full gap-4">
                        <FileIcon fileType={file.type}/>
                        {file.name}
                    </div>
                </section>
            </Button>
        </div>
    );
}
