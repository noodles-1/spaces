import React from "react";

import { flexRender, Row } from "@tanstack/react-table";
import { useDraggable } from "@dnd-kit/core";

import { TableCell, TableRow } from "@/components/ui/table";

export function DraggableRow<TData>({
    row,
    idx,
    draggedRowId,
    handleLeftClick,
    handleRightClick,
}: {
    row: Row<TData>;
    idx: number;
    draggedRowId: string;
    handleLeftClick: (event: React.MouseEvent, idx: number) => void;
    handleRightClick: (idx: number) => void;
}) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: row.id,
    });

    return (
        <TableRow
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            data-state={row.getIsSelected() && "selected"}
            className={`group grid grid-cols-5 transition-opacity delay-[10ms] hover:bg-zinc-900 ${draggedRowId && "opacity-20"} `}
            onClick={(event) => handleLeftClick(event, idx)}
            onContextMenu={() => handleRightClick(idx)}
            onDoubleClick={() => console.log(`double clicked: ${idx}`)}
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
