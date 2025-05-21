import React from "react";

import { File } from "@/types/file-type";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

export function StaticNonFolderFile({
    idx,
    file,
    handleLeftClick,
    handleRightClick,
}: {
    idx: number;
    file: File;
    handleLeftClick: (event: React.MouseEvent, idx: number) => void;
    handleRightClick: (idx: number) => void;
}) {
    return (
        <div className="relative h-44 w-[230px]">
            <Button
                variant="outline"
                className="flex h-full w-full flex-col gap-0 rounded-xl p-0"
                onClick={(event) => handleLeftClick(event, idx)}
                onContextMenu={() => handleRightClick(idx)}
            >
                <div className="flex w-full items-center">
                    <FileIcon contentType={file.category} className="m-4" />
                    {file.name}
                </div>
                <div className="w-full flex-1 px-4 pb-4">
                    <div className="h-full w-full rounded bg-zinc-700" />
                </div>
            </Button>
        </div>
    );
}
