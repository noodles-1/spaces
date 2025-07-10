import React, { Suspense, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { AxiosError } from "axios";

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
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

import { CircleCheck, CircleX, Star } from "lucide-react";

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
import { Move } from "@/components/custom/data/move/move";
import { Rename } from "@/components/custom/data/rename/rename";

import { moveItem } from "@/services/storage";
import { customToast } from "@/lib/custom/custom-toast";

import { DataTableProps } from "@/types/data-table-type";
import { Item } from "@/types/item-type";
import { ResponseDto } from "@/dto/response-dto";

export function DataTable<TData, TValue>({
    columns,
    data,
    starred,
    inaccessible
}: DataTableProps<TData, TValue>) {
    const pathname = usePathname();
    const paths = pathname.split("/");
    const sourceParentId = paths.length === 4 ? paths[3] : undefined;

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [selectedRowsIdx, setSelectedRowsIdx] = useState<Set<number>>(
        () => new Set(),
    );
    const [lastSelectedRowIdx, setLastSelectedRowIdx] = useState<number>(-1);
    const [draggedRowId, setDraggedRowId] = useState<string>("");
    const [openMoveDialog, setOpenMoveDialog] = useState<boolean>(false);
    const [openRenameDialog, setOpenRenameDialog] = useState<boolean>(false);

    const ref = useRef<HTMLDivElement>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);

    const queryClient = useQueryClient();
    const moveItemMutation = useMutation({
        mutationFn: moveItem
    });
    
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
            if (contextMenuRef.current && contextMenuRef.current.contains(event.target as Node)) {
                return;
            }

            if (ref.current && !ref.current.contains(event.target as Node) && event.button === 0) {
                setSelectedRowsIdx(() => new Set());
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const selectedRows = table && table.getSortedRowModel() && table.getSortedRowModel().rows.length > 0 && selectedRowsIdx.size > 0 
        ? [...selectedRowsIdx].map(idx => table.getSortedRowModel().rows[idx].original as Item)
        : [];

    const selectRow = (idx: number) => {
        setSelectedRowsIdx((prev) => new Set(prev).add(idx));
    };

    const deselectRow = (idx: number) => {
        setSelectedRowsIdx((prev) => {
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

            if (selectedRowsIdx.has(idx)) {
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
        setSelectedRowsIdx(() => new Set<number>().add(idx));
    };

    const handleRightClick = (idx: number) => {
        if (selectedRowsIdx.size === 0) {
            setLastSelectedRowIdx(idx);
            setSelectedRowsIdx(() => new Set<number>().add(idx));
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setDraggedRowId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setDraggedRowId("");

        const over = event.over;
        if (over && selectedRows.length > 0) {
            try {
                await Promise.all(selectedRows.map(async (row) => await moveItemMutation.mutateAsync({
                    itemId: row.id,
                    sourceParentId,
                    destinationParentId: over.id.toString()
                })));

                if (sourceParentId) {
                    queryClient.invalidateQueries({
                        queryKey: ["user-accessible-items", sourceParentId]
                    });
                }
                else {
                    queryClient.invalidateQueries({
                        queryKey: ["user-accessible-items"]
                    });
                }

                queryClient.invalidateQueries({
                    queryKey: ["user-accessible-items", over.id.toString()]
                });
                
                const message = selectedRows.length > 1
                    ? `Moved ${selectedRows.length} items.`
                    : `Moved ${selectedRows[0].name}.`;

                customToast({
                    icon: <CircleCheck className="w-4 h-4" color="white" />,
                    message,
                });
            }
            catch (error) {
                const axiosError = error as AxiosError;
                const data = axiosError.response?.data as ResponseDto;

                customToast({
                    icon: <CircleX className="w-4 h-4" color="white" />,
                    message: data.message
                });
            }
            finally {
                setSelectedRowsIdx(() => new Set());
            }
        }
    };

    if (data.length === 0) {
        if (starred) {
            return (
                <section className="flex justify-center">
                    <div className="text-sm text-zinc-400 flex gap-1 items-center">
                        <span> No items found. Add items to starred by pressing the </span>
                        <Star className="w-4 h-4" />
                        <span> icon. </span>
                    </div>
                </section>
            );
        }

        if (inaccessible) {
            return (
                <section className="flex justify-center">
                    <span className="text-sm text-zinc-400"> No deleted items found. </span>
                </section>
            );
        }
        
        return (
            <section className="flex justify-center">
                <span className="text-sm text-zinc-400"> No items found. Upload files by dragging them into this section. </span>
            </section>
        );
    }

    return (
        <div ref={ref}>
            <section className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="z-50 px-6 rounded-lg cursor-pointer"
                        >
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="start"
                        className="p-2 space-y-2"
                    >
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize cursor-pointer"
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
                    className="w-[15rem] z-50"
                />
            </section>
            <ContextMenu>
                <ContextMenuTrigger>
                    {(starred || inaccessible) &&
                        <div className="select-none">
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
                                                                className="flex items-center py-8 bg-zinc-800"
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
                                        table.getRowModel().rows.map((row, i) => selectedRowsIdx.has(i) ? (
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
                                                inaccessible={inaccessible}
                                            />
                                        ) : draggedRowId && !(table.getRow(row.id).original as Item).contentType ? (
                                                <DroppableFolder
                                                    key={row.id}
                                                    file={
                                                        table.getRow(row.id)
                                                            .original as Item
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
                        </div>
                    }
                    {!starred && !inaccessible &&
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
                                                                    className="flex items-center py-8 bg-zinc-800"
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
                                            table.getRowModel().rows.map((row, i) => selectedRowsIdx.has(i) ? (
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
                                            ) : draggedRowId && !(table.getRow(row.id).original as Item).contentType ? (
                                                    <DroppableFolder
                                                        key={row.id}
                                                        file={
                                                            table.getRow(row.id)
                                                                .original as Item
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
                                        <span className="relative flex items-center w-full h-full gap-4 px-4 text-sm">
                                            <FileIcon
                                                contentType={
                                                    (
                                                        table.getRow(
                                                            `${draggedRowId}`,
                                                        ).original as Item
                                                    ).contentType
                                                }
                                                className="w-4 h-4"
                                            />
                                            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                                {
                                                    (
                                                        table.getRow(`${draggedRowId}`)
                                                        .original as Item
                                                    ).name
                                                }
                                            </div>
                                            {selectedRowsIdx.size > 1 && (
                                                <span className="absolute p-2 text-xs rounded-full -top-2 -right-2 bg-zinc-950 outline-1">
                                                    +{selectedRowsIdx.size - 1}
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </DragOverlay>
                            </div>
                        </DndContext>
                    }
                </ContextMenuTrigger>
                <ContextMenuContentDropdown 
                    contextMenuRef={contextMenuRef} 
                    selectedItems={selectedRows}
                    setOpenMoveDialog={setOpenMoveDialog}
                    setOpenRenameDialog={setOpenRenameDialog}
                    setSelectedIdx={setSelectedRowsIdx}
                />
            </ContextMenu>
            <Suspense>
                <Move
                    open={openMoveDialog}
                    selectedItems={selectedRows}
                    setOpen={setOpenMoveDialog}
                    setSelectedIdx={setSelectedRowsIdx}
                />
            </Suspense>
            <Suspense>
                <Rename
                    open={openRenameDialog}
                    selectedItems={selectedRows}
                    setOpen={setOpenRenameDialog}
                />
            </Suspense>
        </div>
    );
}
