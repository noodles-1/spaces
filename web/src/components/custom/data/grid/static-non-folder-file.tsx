import React from "react";

import { Item } from "@/types/item-type";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";
import { Preview } from "@/components/custom/data/preview/preview";

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
                className="flex flex-col w-full h-full gap-4 p-4 rounded-xl"
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
