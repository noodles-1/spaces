import React from "react";

import { flexRender, Row } from "@tanstack/react-table";

import { TableCell, TableRow } from "@/components/ui/table";

export function StaticRow<TData>({
    row,
    idx,
    handleLeftClick,
    handleRightClick,
} : {
    row: Row<TData>
    idx: number
    handleLeftClick: (event: React.MouseEvent, idx: number) => void
    handleRightClick: (idx: number) => void
}) {
    return (
        <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="hover:bg-zinc-900 transition-opacity delay-[10ms] group grid grid-cols-5"
            onClick={event => handleLeftClick(event, idx)}
            onContextMenu={() => handleRightClick(idx)}
            onDoubleClick={() => console.log(`double clicked: ${idx}`)}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell 
                    key={cell.id} 
                    className="py-3 flex items-center"
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