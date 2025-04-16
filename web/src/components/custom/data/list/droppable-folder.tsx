import { flexRender, Row } from "@tanstack/react-table";
import { useDroppable } from "@dnd-kit/core";

import { File } from "@/types/file-type";

import { TableCell, TableRow } from "@/components/ui/table";

export function DroppableFolder<TData>({
    row,
    file,
}: {
    row: Row<TData>
    file: File
}) {
    const { setNodeRef } = useDroppable({
        id: file.name
    });

    return (
        <TableRow
            key={row.id}
            ref={setNodeRef}
            data-state={row.getIsSelected() && "selected"}
            className="bg-zinc-700 hover:bg-zinc-600 transition-all hover:ring-2 hover:ring-gray-300 hover:ring-inset grid grid-cols-5"
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