import React from "react";

import { flexRender, Row } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";

export function StaticRow<TData>({
    row,
    handleLeftClick,
    handleRightClick,
} : {
    row: Row<TData>
    handleLeftClick: (event: React.MouseEvent, row: Row<TData>) => void
    handleRightClick: (row: Row<TData>) => void
}) {
    return (
        <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="hover:bg-zinc-900 transition-opacity delay-[10ms]"
            onClick={event => handleLeftClick(event, row)}
            onContextMenu={() => handleRightClick(row)}
            onDoubleClick={() => console.log(`double clicked: ${row.id}`)}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell 
                    key={cell.id} 
                    className="py-3"
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