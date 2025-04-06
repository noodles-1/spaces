import { Folder as FolderIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EllipsisDropdown } from "@/components/custom/data/ellipsis-dropdown";

import { DROPDOWN_ITEM_GROUPS } from "@/constants/data/placeholder";

interface FolderItem {
    name: string;
}

export function Folder({ folderItem }: { folderItem: FolderItem }) {
    return (
        <div className="relative h-14 w-[230px]">
            <Button variant="outline" className="w-full h-full p-0 rounded-xl">
                <section className="flex items-center justify-between w-full h-full mx-4">
                    <div className="flex items-center w-full h-full gap-4">
                        <FolderIcon fill="white" />
                        {folderItem.name}
                    </div>
                </section>
            </Button>
            <EllipsisDropdown 
                itemGroups={DROPDOWN_ITEM_GROUPS} 
                className="absolute -translate-y-1/2 top-1/2 right-3"
            />
        </div>
    );
}
