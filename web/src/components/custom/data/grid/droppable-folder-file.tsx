import React from "react";

import { useDroppable } from "@dnd-kit/core";

import { Item } from "@/types/item-type";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

export function DroppableFolderFile({ file }: { file: Item }) {
    const { setNodeRef } = useDroppable({
        id: file.name,
    });

    return (
        <div
            ref={setNodeRef}
            className="relative h-14 w-[230px] rounded-lg bg-zinc-700 transition-all hover:bg-zinc-600 hover:ring-2 hover:ring-gray-300 hover:ring-inset"
        >
            <Button variant="outline" className="h-full w-full rounded-xl p-0">
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
