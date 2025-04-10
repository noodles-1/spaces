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
import { 
    ContextMenu, 
    ContextMenuTrigger 
} from "@/components/ui/context-menu";

import { ContextMenuContentDropdown } from "@/components/custom/data/context-menu-content-dropdown";

import { DROPDOWN_ITEM_GROUPS } from "@/constants/data/placeholder";

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

    const handleLeftClick = (event: React.MouseEvent, row: Row<TData>) => {
        if (event.ctrlKey && event.shiftKey) {
            return;
        }

        if (event.ctrlKey) {
            setLastSelectedRowId(parseInt(row.id));
            row.toggleSelected();
            return;
        }

        if (event.shiftKey && 0 <= lastSelectedRowId) {
            const start = Math.min(lastSelectedRowId, parseInt(row.id));
            const end = Math.max(lastSelectedRowId, parseInt(row.id));


            for (let i = 0; i < table.getRowCount(); i++) {
                const currRow = table.getRow(`${i}`);

                if (start <= i && i <= end) {
                    currRow.toggleSelected(true);
                }
                else {
                    currRow.toggleSelected(false);
                }
            }

            return;
        }

        setLastSelectedRowId(parseInt(row.id));
        setRowSelection({ [row.id]: true });
    };

    const handleRightClick = (row: Row<TData>) => {
        if (Object.keys(rowSelection).length === 0) {
            setLastSelectedRowId(parseInt(row.id));
            setRowSelection({ [row.id]: true });
        }
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
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
                                        onClick={(event) => handleLeftClick(event, row)}
                                        onContextMenu={() => handleRightClick(row)}
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
            </ContextMenuTrigger>
            <ContextMenuContentDropdown itemGroups={DROPDOWN_ITEM_GROUPS}/>
        </ContextMenu>
    );
}
