import { Dispatch, SetStateAction } from "react"

import { Dialog } from "@/components/ui/dialog"
import { RenameForm } from "@/components/custom/data/rename/rename-form";

import { Item } from "@/types/item-type"

export function Rename({
    open,
    selectedItems,
    setOpen
}: {
    open: boolean
    selectedItems: Item[]
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <Dialog open={open}>
            <RenameForm
                selectedItems={selectedItems}
                setOpen={setOpen}
            />
        </Dialog>
    );
}