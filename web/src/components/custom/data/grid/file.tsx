import { FileType } from "@/types/file-types";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

interface FileItem {
    name: string;
    type: FileType;
}

export function File({
    fileItem,
}: {
    fileItem: FileItem,
}) {
    return (
        <Button variant="outline" className="w-[230px] rounded-xl h-44 p-0 flex flex-col gap-0">
            <div className="w-full flex items-center">
                <FileIcon fileType={fileItem.type} className="m-4" />
                {fileItem.name}
            </div>
            <div className="flex-1 w-full px-4 pb-4">
                <div className="bg-zinc-700 h-full w-full rounded" />
            </div>
        </Button>
    );
}