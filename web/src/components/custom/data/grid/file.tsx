import { FileType } from "@/types/file-types";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

import { EllipsisDropdown } from "@/components/custom/data/ellipsis-dropdown";
import { ContextMenuContentDropdown } from "@/components/custom/data/context-menu-content-dropdown";

import { DROPDOWN_ITEM_GROUPS } from "@/constants/data/placeholder";

interface FileItem {
    name: string;
    type: FileType;
}

export function File({ fileItem }: { fileItem: FileItem }) {
    return (
        <div className="relative h-44 w-[230px]">
            <ContextMenu>
                <ContextMenuTrigger>
                    <Button
                        variant="outline"
                        className="flex h-full w-full flex-col gap-0 rounded-xl p-0"
                    >
                        <div className="flex w-full items-center">
                            <FileIcon
                                fileType={fileItem.type}
                                className="m-4"
                            />
                            {fileItem.name}
                        </div>
                        <div className="w-full flex-1 px-4 pb-4">
                            <div className="h-full w-full rounded bg-zinc-700" />
                        </div>
                    </Button>
                </ContextMenuTrigger>
                <ContextMenuContentDropdown itemGroups={DROPDOWN_ITEM_GROUPS} />
            </ContextMenu>
            <EllipsisDropdown
                itemGroups={DROPDOWN_ITEM_GROUPS}
                className="absolute top-3 right-3"
            />
        </div>
    );
}
