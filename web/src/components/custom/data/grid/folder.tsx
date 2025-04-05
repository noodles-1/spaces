import { EllipsisVertical, Folder as FolderIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FolderItem {
    name: string;
}

export function Folder({ 
    folderItem 
}: { 
    folderItem: FolderItem 
}) {
    return (
        <Button variant="outline" className="w-[230px] rounded-xl h-14 p-0">
            <section className="w-full h-full flex justify-between items-center mx-4">
                <div className="w-full h-full flex items-center gap-4">
                    <FolderIcon fill="white" />
                    {folderItem.name}
                </div>
                <EllipsisVertical />
            </section>
        </Button>
    );
}