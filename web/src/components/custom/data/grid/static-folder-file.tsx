import React from "react";

import { Item } from "@/types/item-type";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

export function StaticFolderFile({
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
        <div className="relative h-14 w-[230px]">
            <Button
                variant="outline"
                className="h-full w-full rounded-xl p-0"
                onClick={(event) => handleLeftClick(event, idx)}
                onContextMenu={() => handleRightClick(idx)}
            >
                <section className="mx-4 flex h-full w-full items-center justify-between">
                    <div className="flex h-full w-full items-center gap-4">
                        <FileIcon contentType={file.contentType} />
                        {file.name}
                    </div>
                </section>
            </Button>
        </div>
    );
}
