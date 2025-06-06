import React from "react";
import { useRouter } from "next/navigation";

import { CircleX } from "lucide-react";

import { Item } from "@/types/item-type";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

import { customToast } from "@/lib/custom/custom-toast";

export function StaticFolderFile({
    idx,
    file,
    handleLeftClick,
    handleRightClick,
    inaccessible
}: {
    idx: number;
    file: Item;
    handleLeftClick: (event: React.MouseEvent, idx: number) => void;
    handleRightClick: (idx: number) => void;
    inaccessible?: boolean;
}) {
    const router = useRouter();

    const handleDoubleClick = () => {
        if (inaccessible) {
            customToast({
                icon: <CircleX className="w-4 h-4" color="white" />,
                message: "Cannot open folder because it is currently deleted."
            });
        }
        else {
            router.push(`/spaces/folders/${file.id}`)
        }
    };

    return (
        <div className="relative h-14 w-[230px]">
            <Button
                variant="outline"
                className="w-full h-full p-4 rounded-xl"
                onClick={(event) => handleLeftClick(event, idx)}
                onDoubleClick={() => handleDoubleClick()}
                onContextMenu={() => handleRightClick(idx)}
            >
                <section className="flex items-center justify-between w-full h-full">
                    <div className="flex items-center w-full h-full gap-4">
                        <FileIcon contentType={file.contentType} />
                        <div className="flex-1 overflow-hidden text-left text-ellipsis whitespace-nowrap">
                            {file.name}
                        </div>
                    </div>
                </section>
            </Button>
        </div>
    );
}
