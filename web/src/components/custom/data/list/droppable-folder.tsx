import { flexRender, Row } from "@tanstack/react-table";
import { useDroppable } from "@dnd-kit/core";

import { File } from "@/types/file-type";

import { TableCell, TableRow } from "@/components/ui/table";

export function DroppableFolder<TData>({
    row,
    file,
}: {
    row: Row<TData>;
    file: File;
}) {
    const { setNodeRef } = useDroppable({
        id: file.name,
    });

    return (
        <TableRow
            key={row.id}
            ref={setNodeRef}
            data-state={row.getIsSelected() && "selected"}
            className="grid grid-cols-5 bg-zinc-700 transition-all hover:bg-zinc-600 hover:ring-2 hover:ring-gray-300 hover:ring-inset"
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="flex items-center py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}
