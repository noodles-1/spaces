import React from "react";
import { useRouter } from "next/navigation";

import { flexRender, Row } from "@tanstack/react-table";
import { useDraggable } from "@dnd-kit/core";

import { CircleX } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui/table";

import { customToast } from "@/lib/custom/custom-toast";
import { Item } from "@/types/item-type";

export function DraggableRow<TData>({
    row,
    idx,
    draggedRowId,
    handleLeftClick,
    handleRightClick,
    inaccessible,
}: {
    row: Row<TData>;
    idx: number;
    draggedRowId: string;
    handleLeftClick: (event: React.MouseEvent, idx: number) => void;
    handleRightClick: (idx: number) => void;
    inaccessible?: boolean;
}) {
    const router = useRouter();

    const { attributes, listeners, setNodeRef } = useDraggable({
        id: row.id,
    });

    const handleDoubleClick = () => {
        if (inaccessible) {
            customToast({
                icon: <CircleX className="w-4 h-4" color="white" />,
                message: "Cannot open folder because it is deleted."
            });
        }
        else {
            const item = (row.original) as Item;

            if (item.type === "FOLDER") {
                router.push(`/spaces/folders/${item.id}`)
            }
        }
    };

    return (
        <TableRow
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            data-state={row.getIsSelected() && "selected"}
            className={`group grid grid-cols-5 transition-opacity delay-[10ms] hover:bg-zinc-900 ${draggedRowId && "opacity-20"} `}
            onClick={(event) => handleLeftClick(event, idx)}
            onContextMenu={() => handleRightClick(idx)}
            onDoubleClick={() => handleDoubleClick()}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell
                    key={cell.id}
                    className="flex items-center bg-[#79a1ff56] py-3"
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}
