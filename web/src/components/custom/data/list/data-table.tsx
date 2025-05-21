import React, { useEffect, useRef, useState } from "react";

import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    VisibilityState,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table";

import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    pointerWithin,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import { DataTableProps } from "@/types/data-table-type";
import { File } from "@/types/file-type";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ContextMenuContentDropdown } from "@/components/custom/data/context-menu-content-dropdown";
import { DraggableRow } from "@/components/custom/data/list/draggable-row";
import { DroppableFolder } from "@/components/custom/data/list/droppable-folder";
import { StaticRow } from "@/components/custom/data/list/static-row";
import { snapTopLeftToCursor } from "@/components/custom/data/modifiers/snap-top-left";
import { FileIcon } from "@/components/custom/data/file-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DROPDOWN_ITEM_GROUPS } from "@/constants/data/placeholder";

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(
        () => new Set(),
    );
    const [lastSelectedRowIdx, setLastSelectedRowIdx] = useState<number>(-1);
    const [draggedRowId, setDraggedRowId] = useState<string>("");

    const ref = useRef<HTMLDivElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 40,
            },
        }),
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnVisibility,
            columnFilters,
        },
    });

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node) &&
                event.button === 0
            ) {
                setSelectedRows(() => new Set());
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const selectRow = (idx: number) => {
        setSelectedRows((prev) => new Set(prev).add(idx));
    };

    const deselectRow = (idx: number) => {
        setSelectedRows((prev) => {
            const next = new Set(prev);
            next.delete(idx);
            return next;
        });
    };

    const handleLeftClick = (event: React.MouseEvent, idx: number) => {
        if (event.ctrlKey && event.shiftKey) {
            return;
        }

        if (event.ctrlKey) {
            setLastSelectedRowIdx(idx);

            if (selectedRows.has(idx)) {
                deselectRow(idx);
            } else {
                selectRow(idx);
            }

            return;
        }

        if (event.shiftKey && 0 <= lastSelectedRowIdx) {
            const start = Math.min(lastSelectedRowIdx, idx);
            const end = Math.max(lastSelectedRowIdx, idx);

            for (let i = 0; i < table.getRowCount(); i++) {
                if (start <= i && i <= end) {
                    selectRow(i);
                } else {
                    deselectRow(i);
                }
            }

            return;
        }

        setLastSelectedRowIdx(idx);
        setSelectedRows(() => new Set<number>().add(idx));
    };

    const handleRightClick = (idx: number) => {
        if (selectedRows.size === 0) {
            setLastSelectedRowIdx(idx);
            setSelectedRows(() => new Set<number>().add(idx));
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setDraggedRowId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setDraggedRowId("");

        if (event.over) {
            console.log(event.over.id);
        }
    };

    return (
        <main>
            <section className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="cursor-pointer rounded-lg px-6"
                        >
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="space-y-2 p-2"
                    >
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="cursor-pointer capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                        onSelect={(event) =>
                                            event.preventDefault()
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Input
                    placeholder="Filter names..."
                    value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="w-[15rem]"
                />
            </section>
            <ContextMenu>
                <ContextMenuTrigger>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={pointerWithin}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div ref={ref} className="select-none">
                            <Table>
                                <TableHeader className="sticky top-0 table w-full table-fixed">
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <TableRow
                                                key={headerGroup.id}
                                                className="grid grid-cols-5 grid-rows-1"
                                            >
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <TableHead
                                                                key={header.id}
                                                                className="flex items-center bg-zinc-800 py-8"
                                                            >
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                          header
                                                                              .column
                                                                              .columnDef
                                                                              .header,
                                                                          header.getContext(),
                                                                      )}
                                                            </TableHead>
                                                        );
                                                    },
                                                )}
                                            </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody
                                    className="block"
                                    style={{ height: "calc(100vh - 300px)" }}
                                >
                                    {table.getRowModel().rows?.length ? (
                                        table
                                            .getRowModel()
                                            .rows.map((row, i) =>
                                                selectedRows.has(i) ? (
                                                    <DraggableRow<TData>
                                                        key={row.id}
                                                        row={row}
                                                        idx={i}
                                                        draggedRowId={
                                                            draggedRowId
                                                        }
                                                        handleLeftClick={
                                                            handleLeftClick
                                                        }
                                                        handleRightClick={
                                                            handleRightClick
                                                        }
                                                    />
                                                ) : draggedRowId &&
                                                  (
                                                      table.getRow(row.id)
                                                          .original as File
                                                  ).category === "folder" ? (
                                                    <DroppableFolder
                                                        key={row.id}
                                                        file={
                                                            table.getRow(row.id)
                                                                .original as File
                                                        }
                                                        row={row}
                                                    />
                                                ) : (
                                                    <StaticRow<TData>
                                                        key={row.id}
                                                        row={row}
                                                        idx={i}
                                                        handleLeftClick={
                                                            handleLeftClick
                                                        }
                                                        handleRightClick={
                                                            handleRightClick
                                                        }
                                                    />
                                                ),
                                            )
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
                            <DragOverlay
                                modifiers={[
                                    snapTopLeftToCursor,
                                    restrictToWindowEdges,
                                ]}
                                className="max-w-[150px] rounded-lg bg-zinc-950 shadow-xs shadow-zinc-600"
                            >
                                {draggedRowId && (
                                    <span className="relative flex h-full w-full items-center gap-4 px-4 text-sm">
                                        <FileIcon
                                            contentType={
                                                (
                                                    table.getRow(
                                                        `${draggedRowId}`,
                                                    ).original as File
                                                ).category
                                            }
                                            className="h-4 w-4"
                                        />
                                        {
                                            (
                                                table.getRow(`${draggedRowId}`)
                                                    .original as File
                                            ).name
                                        }
                                        {selectedRows.size > 1 && (
                                            <span className="absolute -top-2 -right-2 rounded-full bg-zinc-950 p-2 text-xs outline-1">
                                                +{selectedRows.size - 1}
                                            </span>
                                        )}
                                    </span>
                                )}
                            </DragOverlay>
                        </div>
                    </DndContext>
                </ContextMenuTrigger>
                {selectedRows.size > 0 ? (
                    <ContextMenuContentDropdown
                        itemGroups={DROPDOWN_ITEM_GROUPS}
                    />
                ) : (
                    <ContextMenuContentDropdown />
                )}
            </ContextMenu>
        </main>
    );
}
