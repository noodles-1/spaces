import React from "react";

import { useDraggable } from "@dnd-kit/core";
import { Item } from "@/types/item-type";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";
import { Preview } from "@/components/custom/data/preview/preview";

export function DraggableNonFolderFile({
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
            className="relative h-44 w-[230px]"
        >
            <Button
                variant="outline"
                className={`flex h-full w-full flex-col gap-4 rounded-xl p-4 ring-2 ring-[#79a1ffc2] ring-inset ${draggedFileIdx >= 0 && "opacity-20"} `}
                onClick={(event) => handleLeftClick(event, idx)}
                onContextMenu={() => handleRightClick(idx)}
            >
                <div className="flex items-center w-full gap-4">
                    <FileIcon contentType={file.contentType} />
                    <div className="flex-1 overflow-hidden text-left text-ellipsis whitespace-nowrap">
                        {file.name}
                    </div>
                </div>
                <div className="flex-1 w-full overflow-hidden">
                    {file.contentType &&
                        <Preview contentType={file.contentType} file={file} />
                    }
                </div>
            </Button>
        </div>
    );
}
