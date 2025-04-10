'use client'

import React, { useEffect, useRef, useState } from "react";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [lastSelectedRowId, setLastSelectedRowId] = useState<number>(-1);

    const ref = useRef<HTMLDivElement>(null);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
    });

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node) && event.button === 0) {
                setRowSelection({});
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleSelect = (event: React.MouseEvent, row: Row<TData>) => {
        if (event.ctrlKey && event.shiftKey) {
            return;
        }

        if (event.ctrlKey) {
            row.toggleSelected();
            return;
        }

        if (event.shiftKey && 0 <= lastSelectedRowId) {
            const start = Math.min(lastSelectedRowId, parseInt(row.id));
            const end = Math.max(lastSelectedRowId, parseInt(row.id));

            for (let i = start; i <= end; i++) {
                table.getRow(`${i}`).toggleSelected(true);
            }

            return;
        }

        setLastSelectedRowId(parseInt(row.id));
        setRowSelection({ [row.id]: true });
    };

    return (
        <div ref={ref} className="select-none">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} className="py-3">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef
                                                    .header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="hover:bg-zinc-900"
                                onClick={(event) => handleSelect(event, row)}
                                onDoubleClick={() => console.log(`double clicked: ${row.id}`)}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell 
                                        key={cell.id} 
                                        className={`
                                            py-3 
                                            ${row.getIsSelected() && "bg-[#79a1ff56]"}
                                        `}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
