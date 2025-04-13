import React from "react";

import { File } from "@/types/file-type";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

export function StaticNonFolderFile({ 
    idx,
    file,
    handleLeftClick,
    handleRightClick,
} : { 
    idx: number
    file: File
    handleLeftClick: (event: React.MouseEvent, idx: number) => void
    handleRightClick: (idx: number) => void
}) {
    return (
        <div className="relative h-44 w-[230px]">
            <Button
                variant="outline"
                className="flex flex-col w-full h-full gap-0 p-0 rounded-xl"
                onClick={event => handleLeftClick(event, idx)}
                onContextMenu={() => handleRightClick(idx)}
            >
                <div className="flex items-center w-full">
                    <FileIcon
                        fileCategory={file.category}
                        className="m-4"
                    />
                    {file.name}
                </div>
                <div className="flex-1 w-full px-4 pb-4">
                    <div className="w-full h-full rounded bg-zinc-700" />
                </div>
            </Button>
        </div>
    );
}
