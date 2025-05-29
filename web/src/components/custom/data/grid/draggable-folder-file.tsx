import React from "react";
import { useRouter } from "next/navigation";

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
    const router = useRouter();

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
                onDoubleClick={() => router.push(`/spaces/folders/${file.id}`)}
                onContextMenu={() => handleRightClick(idx)}
            >
                <section className="flex items-center justify-between w-full h-full">
                    <div className="flex items-center w-full h-full gap-4">
                        <FileIcon contentType={file.contentType} />
                        <div className="flex-1 overflow-hidden text-left text-ellipsis whitespace-nowrap">
                            {file.name}
                        </div>
                    </div>
                </section>
            </Button>
        </div>
    );
}
