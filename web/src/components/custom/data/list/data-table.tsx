import React, { useEffect, useRef, useState } from "react";

import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    Row,
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
import { 
    ContextMenu, 
    ContextMenuTrigger 
} from "@/components/ui/context-menu";
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
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [lastSelectedRowId, setLastSelectedRowId] = useState<number>(-1);
    const [draggedRowId, setDraggedRowId] = useState<string>("");

    const ref = useRef<HTMLDivElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 40
            }
        }),
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            rowSelection,
            columnVisibility,
            columnFilters,
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
                        <Button variant="outline" className="cursor-pointer rounded-lg px-6">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="space-y-2 p-2">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize cursor-pointer"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={value => column.toggleVisibility(!!value)}
                                        onSelect={event => event.preventDefault()}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            }
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Input
                    placeholder="Filter names..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={event => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="w-[15rem]"
                />
            </section>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div ref={ref} className="select-none mb-[200px]">
                        <DndContext 
                            sensors={sensors} 
                            collisionDetection={pointerWithin}
                            onDragStart={handleDragStart} 
                            onDragEnd={handleDragEnd}
                        >
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
                                        table.getRowModel().rows.map(row => (
                                            row.id in rowSelection ? (
                                                <DraggableRow<TData> 
                                                    key={row.id}
                                                    row={row}
                                                    draggedRowId={draggedRowId}
                                                    handleLeftClick={handleLeftClick}
                                                    handleRightClick={handleRightClick}
                                                />
                                            ) : (
                                                draggedRowId && (table.getRow(row.id).original as File).type === "folder" ? (
                                                    <DroppableFolder
                                                        key={row.id}
                                                        row={row}
                                                    />
                                                ) : (
                                                    <StaticRow<TData> 
                                                        key={row.id}
                                                        row={row}
                                                        handleLeftClick={handleLeftClick}
                                                        handleRightClick={handleRightClick}
                                                    />
                                                )
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
                            <DragOverlay 
                                modifiers={[snapTopLeftToCursor, restrictToWindowEdges]}
                                className="max-w-[150px] bg-zinc-950 rounded-lg shadow-zinc-600 shadow-xs"
                            >
                                {draggedRowId &&
                                    <span className="relative flex items-center w-full h-full gap-4 px-4 text-sm">
                                        <FileIcon fileType={(table.getRow(`${draggedRowId}`).original as File).type} className="w-4 h-4"/>
                                        {(table.getRow(`${draggedRowId}`).original as File).name}
                                        {Object.keys(rowSelection).length > 1 &&
                                            <span className="absolute p-2 text-xs rounded-full -top-2 -right-2 bg-zinc-950 outline-1">
                                                +{Object.keys(rowSelection).length - 1}
                                            </span>
                                        }
                                    </span>
                                }
                            </DragOverlay>
                        </DndContext>
                    </div>
                </ContextMenuTrigger>
                {Object.keys(rowSelection).length > 0 ? (
                    <ContextMenuContentDropdown itemGroups={DROPDOWN_ITEM_GROUPS}/>
                ) : (
                    <ContextMenuContentDropdown />
                )}
            </ContextMenu>
        </main>
    );
}
