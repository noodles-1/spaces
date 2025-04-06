import { FileType } from "@/types/file-types";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";
import { EllipsisDropdown } from "@/components/custom/data/ellipsis-dropdown";

import { DROPDOWN_ITEM_GROUPS } from "@/constants/data/placeholder";

interface FileItem {
    name: string;
    type: FileType;
}

export function File({ fileItem }: { fileItem: FileItem }) {
    return (
        <div className="h-44 w-[230px] relative">
            <Button
                variant="outline"
                className="flex flex-col w-full h-full gap-0 p-0 rounded-xl"
            >
                <div className="flex items-center w-full">
                    <FileIcon fileType={fileItem.type} className="m-4" />
                    {fileItem.name}
                </div>
                <div className="flex-1 w-full px-4 pb-4">
                    <div className="w-full h-full rounded bg-zinc-700" />
                </div>
            </Button>
            <EllipsisDropdown
                itemGroups={DROPDOWN_ITEM_GROUPS} 
                className="absolute top-3 right-3"
            />
        </div>
    );
}
