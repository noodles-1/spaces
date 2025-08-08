import { Dispatch, SetStateAction, useState } from "react";
import { usePathname } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { HomeMoveTreeView } from "@/components/custom/data/move/home-move-tree-view";
import { RootMoveTreeView } from "@/components/custom/data/move/root-move-tree-view";

import { Item } from "@/types/item-type";

export function Move({
    open,
    selectedItems,
    setOpen,
    setSelectedIdx
}: {
    open: boolean
    selectedItems: Item[]
    setOpen: Dispatch<SetStateAction<boolean>>
    setSelectedIdx: Dispatch<SetStateAction<Set<number>>>
}) {
    const pathname = usePathname();
    const paths = pathname.split("/");
    const sourceParentId = paths.length === 4 ? paths[3] : undefined;

    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

    return (
        <Dialog open={open}>
            <DialogContent className="bg-zinc-800 w-[28rem] [&>button]:hidden flex flex-col gap-3">
                <DialogHeader>
                    <DialogTitle className="font-medium"> Move to folder </DialogTitle>
                    {selectedItems.length > 1 ?
                        <DialogDescription> Move {selectedItems.length} items to another folder </DialogDescription>
                    :
                        <DialogDescription> Move item to another folder </DialogDescription>
                    }
                </DialogHeader>
                <main className="flex flex-col gap-2">
                    {sourceParentId ?
                        <RootMoveTreeView
                            selectedFolderId={selectedFolderId}
                            selectedItems={selectedItems}
                            sourceParentId={sourceParentId}
                            setSelectedFolderId={setSelectedFolderId}
                            setSelectedItemsIdx={setSelectedIdx}
                            setOpen={setOpen}
                        />
                    :
                        <HomeMoveTreeView 
                            selectedFolderId={selectedFolderId} 
                            selectedItems={selectedItems}
                            setSelectedFolderId={setSelectedFolderId} 
                            setSelectedItemsIdx={setSelectedIdx}
                            setOpen={setOpen}
                        />
                    }
                </main>
            </DialogContent>
        </Dialog>
    );
}