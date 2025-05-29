import React from "react";

import { useDraggable } from "@dnd-kit/core";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

import { Item } from "@/types/item-type";

export function DraggableFolderFile({
    idx,
    file,
    draggedFileIdx,
    handleLeftClick,
    handleRightClick,
}: {
    idx: number;
    file: Item;
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
                className={`h-full w-full rounded-xl p-4 ring-2 ring-[#79a1ffc2] ring-inset ${draggedFileIdx >= 0 && "opacity-20"} `}
                onClick={(event) => handleLeftClick(event, idx)}
                onContextMenu={() => handleRightClick(idx)}
            >
                <section className="flex h-full w-full items-center justify-between">
                    <div className="flex h-full w-full items-center gap-4">
                        <FileIcon contentType={file.contentType} />
                        <div className="flex-1 text-left text-ellipsis whitespace-nowrap overflow-hidden">
                            {file.name}
                        </div>
                    </div>
                </section>
            </Button>
        </div>
    );
}
