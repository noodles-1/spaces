'use client'

import React, { useEffect, useRef, useState } from "react";

import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import { DataTableProps } from "@/types/data-table-type";

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
import { restrictToParentElement } from "@dnd-kit/modifiers";

import { ContextMenuContentDropdown } from "@/components/custom/data/context-menu-content-dropdown";
import { DraggableRow } from "@/components/custom/data/list/draggable-row";
import { StaticRow } from "@/components/custom/data/list/static-row";

import { DROPDOWN_ITEM_GROUPS } from "@/constants/data/placeholder";

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [lastSelectedRowId, setLastSelectedRowId] = useState<number>(-1);
    const [dragging, setDragging] = useState<boolean>(false);

    const ref = useRef<HTMLDivElement>(null);

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 40
        }
    });

    const sensors = useSensors(pointerSensor);

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

    const handleDragStart = () => {
        setDragging(true);
    };

    const handleDragEnd = () => {
        setDragging(false);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div ref={ref} className="select-none">
                    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                                        row.id in rowSelection ? (
                                            <DraggableRow<TData> 
                                                key={row.id}
                                                row={row}
                                                dragging={dragging}
                                                handleLeftClick={handleLeftClick}
                                                handleRightClick={handleRightClick}
                                            />
                                        ) : (
                                            <StaticRow<TData> 
                                                key={row.id}
                                                row={row}
                                                handleLeftClick={handleLeftClick}
                                                handleRightClick={handleRightClick}
                                            />
                                        )
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
                        <DragOverlay modifiers={[restrictToParentElement]} className="bg-green-500 max-w-[100px]">
                            {dragging &&
                                <div className="bg-red-500">
                                    drag meeee
                                </div>
                            }
                        </DragOverlay>
                    </DndContext>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContentDropdown itemGroups={DROPDOWN_ITEM_GROUPS}/>
        </ContextMenu>
    );
}
