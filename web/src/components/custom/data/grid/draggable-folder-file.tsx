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
}: {
    idx: number;
    file: File;
    draggedFileIdx: number;
    handleLeftClick: (event: React.MouseEvent, idx: number) => void;
    handleRightClick: (idx: number) => void;
}) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: idx,
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
                className={`h-full w-full rounded-xl p-0 ring-2 ring-[#79a1ffc2] ${draggedFileIdx >= 0 && "opacity-20"} `}
                onClick={(event) => handleLeftClick(event, idx)}
                onContextMenu={() => handleRightClick(idx)}
            >
                <section className="mx-4 flex h-full w-full items-center justify-between">
                    <div className="flex h-full w-full items-center gap-4">
                        <FileIcon contentType={file.category} />
                        {file.name}
                    </div>
                </section>
            </Button>
        </div>
    );
}
