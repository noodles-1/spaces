import React from "react";
import { useRouter } from "next/navigation";

import { useDraggable } from "@dnd-kit/core";

import { CircleX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

import { customToast } from "@/lib/custom/custom-toast";
import { Item } from "@/types/item-type";

export function DraggableFolderFile({
    idx,
    file,
    draggedFileIdx,
    handleLeftClick,
    handleRightClick,
    inaccessible
}: {
    idx: number;
    file: Item;
    draggedFileIdx: number;
    handleLeftClick: (event: React.MouseEvent, idx: number) => void;
    handleRightClick: (idx: number) => void;
    inaccessible?: boolean;
}) {
    const router = useRouter();

    const { attributes, listeners, setNodeRef } = useDraggable({
        id: idx,
    });

    const handleDoubleClick = () => {
        if (inaccessible) {
            customToast({
                icon: <CircleX className="w-4 h-4" color="white" />,
                message: "Cannot open folder because it is currently deleted."
            });
        }
        else {
            router.push(`/spaces/folders/${file.id}`)
        }
    };

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
                onDoubleClick={() => handleDoubleClick()}
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
