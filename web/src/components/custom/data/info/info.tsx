import { Dispatch, SetStateAction, useEffect, useRef } from "react"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Creator } from "@/components/custom/data/avatar/creator";

import { formatFileSize } from "@/lib/custom/file-size";

import { Item } from "@/types/item-type"

export function Info({
    open,
    selectedItems,
    setOpen
}: {
    open: boolean
    selectedItems: Item[]
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    const selectedItem = selectedItems.length > 0 ? selectedItems[0] : null;

    const selectedItemRef = useRef<Item>(null);

    useEffect(() => {
        if (selectedItem) {
            selectedItemRef.current = selectedItem;
        }
    }, [selectedItem]);

    if (!selectedItemRef.current) {
        return null;
    }

    const createdDate = new Date(selectedItemRef.current.createdAt);
    const formattedCreatedDate = createdDate.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric"
        },
    );

    const updatedDate = new Date(selectedItemRef.current.updatedAt);
    const formattedUpdatedDate = updatedDate.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric"
        },
    );

    return (
        <Sheet open={open}>
            <SheetContent className="w-[24rem] [&>button]:hidden">
                <SheetHeader>
                    <SheetTitle className="break-all"> {selectedItemRef.current.name} </SheetTitle>
                    <SheetDescription> {selectedItemRef.current.type === "FILE" ? "File" : "Folder"} information </SheetDescription>
                </SheetHeader>
                <section className="px-4 text-sm flex flex-col gap-2">
                    {selectedItemRef.current.contentType &&
                        <div className="flex gap-2">
                            <span className="font-semibold"> Content type: </span>
                            <span> {selectedItemRef.current.contentType} </span>
                        </div>
                    }
                    {selectedItemRef.current.size &&
                        <div className="flex gap-2">
                            <span className="font-semibold"> Size: </span>
                            <span> {formatFileSize(selectedItemRef.current.size, 4)} </span>
                        </div>
                    }
                    {selectedItemRef.current.createdBy &&
                        <div className="flex gap-2 items-center">
                            <span className="font-semibold"> Created by: </span>
                            <Creator nameOnly createdBy={selectedItemRef.current.createdBy} />
                        </div>
                    }
                    <div className="flex gap-2">
                        <span className="font-semibold"> Created at: </span>
                        <span> {formattedCreatedDate} </span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold"> Last updated at: </span>
                        <span> {formattedUpdatedDate} </span>
                    </div>
                </section>
                <SheetFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}> Close </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}