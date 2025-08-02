import { Dispatch, SetStateAction, useEffect, useRef } from "react";

import { 
    Dialog, 
    DialogClose, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UsersList } from "@/components/custom/data/share/users-list";

import { Item } from "@/types/item-type";

export function Share({
    open,
    selectedItems,
    setOpen
}: {
    open: boolean
    selectedItems: Item[]
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    const selectedItemRef = useRef<Item>(null);

    useEffect(() => {
        if (selectedItems.length === 1) {
            selectedItemRef.current = selectedItems[0];
        }
    }, [selectedItems]);

    return (
        <Dialog open={open}>
            <DialogContent className="bg-zinc-800 w-[28rem] [&>button]:hidden flex flex-col gap-4">
                <DialogHeader>
                    <DialogTitle className="font-medium">
                        Share this {selectedItemRef.current?.type.toLowerCase()}
                    </DialogTitle>
                    <DialogDescription> Share access to other users </DialogDescription>
                </DialogHeader>
                {selectedItemRef.current &&
                    <section className="flex">
                        <UsersList selectedItem={selectedItemRef.current} />
                    </section>
                }
                <DialogFooter className="flex items-center justify-end">
                    <DialogClose asChild>
                        <Button variant="link" className="cursor-pointer text-spaces-tertiary p-0" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}