import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Clipboard, ClipboardCheck } from "lucide-react";

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
import { AddUser } from "@/components/custom/data/share/add-user";

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

    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (selectedItems.length === 1) {
            selectedItemRef.current = selectedItems[0];
        }
    }, [selectedItems]);

    const handleCopyLink = async () => {
        if (!selectedItemRef.current)
            return;

        const origin = window.location.origin;
        await navigator.clipboard.writeText(`${origin}/spaces/folders/${selectedItemRef.current.id}`);

        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 3000);
    };

    return (
        <Dialog open={open}>
            <DialogContent className="bg-zinc-800 min-w-[52rem] [&>button]:hidden flex flex-col gap-4">
                <DialogHeader>
                    <DialogTitle className="font-medium">
                        Share this {selectedItemRef.current?.type.toLowerCase()}
                    </DialogTitle>
                    <DialogDescription> Share access to other users </DialogDescription>
                </DialogHeader>
                {selectedItemRef.current &&
                    <section className="grid grid-cols-2 gap-8">
                        <UsersList selectedItem={selectedItemRef.current} />
                        <AddUser selectedItem={selectedItemRef.current} />
                    </section>
                }
                <DialogFooter className="flex items-center justify-between">
                    <Button 
                        disabled={copied} 
                        variant="outline" 
                        className="flex items-center gap-3 cursor-pointer h-[3rem]"
                        onClick={handleCopyLink}
                    >
                        {!copied ?
                            <>
                                <Clipboard className="stroke-zinc-300" />
                                <span> Copy link </span>
                            </>
                        :
                            <>
                                <ClipboardCheck className="stroke-zinc-300" />
                                <span> Link copied! </span>
                            </>
                        }
                    </Button>
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