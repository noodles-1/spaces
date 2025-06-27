import { Dispatch, SetStateAction, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { MoveTreeView } from "@/components/custom/data/move/move-tree-view";

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
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

    return (
        <Dialog open={open}>
            <DialogContent className="bg-zinc-800 w-[28rem] [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className="font-medium"> Move to folder </DialogTitle>
                    {selectedItems.length > 1 ?
                        <DialogDescription> Move {selectedItems.length} items to another folder </DialogDescription>
                    :
                        <DialogDescription> Move item to another folder </DialogDescription>
                    }
                </DialogHeader>
                <main className="flex flex-col gap-2">
                    <MoveTreeView 
                        selectedFolderId={selectedFolderId} 
                        selectedItems={selectedItems}
                        setSelectedFolderId={setSelectedFolderId} 
                        setSelectedItemsIdx={setSelectedIdx}
                        setOpen={setOpen}
                    />
                </main>
            </DialogContent>
        </Dialog>
    );
}