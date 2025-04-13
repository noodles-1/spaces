import React from "react";

import { flexRender, Row } from "@tanstack/react-table";
import { useDraggable } from "@dnd-kit/core";

import { TableCell, TableRow } from "@/components/ui/table";

export function DraggableRow<TData>({
    row,
    draggedRowId,
    handleLeftClick,
    handleRightClick,
} : {
    row: Row<TData>
    draggedRowId: string
    handleLeftClick: (event: React.MouseEvent, row: Row<TData>) => void
    handleRightClick: (row: Row<TData>) => void
}) {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: row.id
    });

    return (
        <TableRow
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            data-state={row.getIsSelected() && "selected"}
            className={`
                hover:bg-zinc-900 transition-opacity delay-[10ms] group
                ${draggedRowId && "opacity-20"}
            `}
            onClick={event => handleLeftClick(event, row)}
            onContextMenu={() => handleRightClick(row)}
            onDoubleClick={() => console.log(`double clicked: ${row.id}`)}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell 
                    key={cell.id} 
                    className="py-3 bg-[#79a1ff56]"
                >
                    {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                    )}
                </TableCell>
            ))}
        </TableRow>
    );
}