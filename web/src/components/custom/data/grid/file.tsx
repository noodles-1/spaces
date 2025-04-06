import { FileType } from "@/types/file-types";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

interface FileItem {
    name: string;
    type: FileType;
}

export function File({ fileItem }: { fileItem: FileItem }) {
    return (
        <Button
            variant="outline"
            className="flex h-44 w-[230px] flex-col gap-0 rounded-xl p-0"
        >
            <div className="flex w-full items-center">
                <FileIcon fileType={fileItem.type} className="m-4" />
                {fileItem.name}
            </div>
            <div className="w-full flex-1 px-4 pb-4">
                <div className="h-full w-full rounded bg-zinc-700" />
            </div>
        </Button>
    );
}
