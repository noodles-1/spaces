import React from "react";

import { File } from "@/types/file-type";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

export function StaticFolderFile({ 
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
        <div className="relative h-14 w-[230px]">
            <Button
                variant="outline"
                className="w-full h-full p-0 rounded-xl"
                onClick={event => handleLeftClick(event, idx)}
                onContextMenu={() => handleRightClick(idx)}
            >
                <section className="flex items-center justify-between w-full h-full mx-4">
                    <div className="flex items-center w-full h-full gap-4">
                        <FileIcon fileType={file.type}/>
                        {file.name}
                    </div>
                </section>
            </Button>
        </div>
    );
}
