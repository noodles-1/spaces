import { Folder as FolderIcon } from "lucide-react";

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";

import { EllipsisDropdown } from "@/components/custom/data/ellipsis-dropdown";
import { ContextMenuContentDropdown } from "@/components/custom/data/context-menu-content-dropdown";

import { DROPDOWN_ITEM_GROUPS } from "@/constants/data/placeholder";

interface FolderItem {
    name: string;
}

export function Folder({ folderItem }: { folderItem: FolderItem }) {
    return (
        <div className="relative h-14 w-[230px]">
            <ContextMenu>
                <ContextMenuTrigger className="h-full w-full">
                    <Button
                        variant="outline"
                        className="h-full w-full rounded-xl p-0"
                    >
                        <section className="mx-4 flex h-full w-full items-center justify-between">
                            <div className="flex h-full w-full items-center gap-4">
                                <FolderIcon fill="white" />
                                {folderItem.name}
                            </div>
                        </section>
                    </Button>
                </ContextMenuTrigger>
                <ContextMenuContentDropdown itemGroups={DROPDOWN_ITEM_GROUPS} />
            </ContextMenu>
            <EllipsisDropdown
                itemGroups={DROPDOWN_ITEM_GROUPS}
                className="absolute top-1/2 right-3 -translate-y-1/2"
            />
        </div>
    );
}
