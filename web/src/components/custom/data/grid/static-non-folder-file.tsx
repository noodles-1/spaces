import React from "react";

import { Item } from "@/types/item-type";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

export function StaticNonFolderFile({
    idx,
    file,
    handleLeftClick,
    handleRightClick,
}: {
    idx: number;
    file: Item;
    handleLeftClick: (event: React.MouseEvent, idx: number) => void;
    handleRightClick: (idx: number) => void;
}) {
    return (
        <div className="relative h-44 w-[230px]">
            <Button
                variant="outline"
                className="flex h-full w-full flex-col gap-4 rounded-xl p-4"
                onClick={(event) => handleLeftClick(event, idx)}
                onContextMenu={() => handleRightClick(idx)}
            >
                <div className="flex gap-2 w-full items-center">
                    <FileIcon contentType={file.contentType} />
                    <div className="flex-1 text-left text-ellipsis whitespace-nowrap overflow-hidden">
                        {file.name}
                    </div>
                </div>
                <div className="w-full flex-1">
                    <div className="h-full w-full rounded bg-zinc-700" />
                </div>
            </Button>
        </div>
    );
}
