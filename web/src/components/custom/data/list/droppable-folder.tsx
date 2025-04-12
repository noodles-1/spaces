import { flexRender, Row } from "@tanstack/react-table";
import { useDroppable } from "@dnd-kit/core";

import { TableCell, TableRow } from "@/components/ui/table";

export function DroppableFolder<TData>({
    row,
}: {
    row: Row<TData>
}) {
    const { setNodeRef } = useDroppable({
        id: row.id
    });

    return (
        <TableRow
            key={row.id}
            ref={setNodeRef}
            data-state={row.getIsSelected() && "selected"}
            className="hover:opacity-60 hover:bg-zinc-900 transition-all delay-[10ms]"
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