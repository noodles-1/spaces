import React from "react";

import { useDraggable } from "@dnd-kit/core";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

import { File } from "@/types/file-type";

export function DraggableFolderFile({
    idx,
    file,
    draggedFileIdx,
    handleLeftClick,
    handleRightClick,
} : {
    idx: number
    file: File
    draggedFileIdx: number
    handleLeftClick: (event: React.MouseEvent, idx: number) => void
    handleRightClick: (idx: number) => void
}) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: idx
    });

    return (
        <div 
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="relative h-14 w-[230px]"
        >
            <Button
                variant="outline"
                className={`
                    w-full h-full p-0 rounded-xl ring-2 ring-[#79a1ffc2]
                    ${draggedFileIdx >= 0 && "opacity-20"}    
                `}
                onClick={event => handleLeftClick(event, idx)}
                onContextMenu={() => handleRightClick(idx)}
            >
                <section className="flex items-center justify-between w-full h-full mx-4">
                    <div className="flex items-center w-full h-full gap-4">
                        <FileIcon fileCategory={file.category}/>
                        {file.name}
                    </div>
                </section>
            </Button>
        </div>
    );
}