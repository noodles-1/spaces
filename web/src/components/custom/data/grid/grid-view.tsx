import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { AxiosError } from "axios";

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

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

import { StaticFolderFile } from "@/components/custom/data/grid/static-folder-file";
import { StaticNonFolderFile } from "@/components/custom/data/grid/static-non-folder-file";
import { DraggableFolderFile } from "@/components/custom/data/grid/draggable-folder-file";
import { DraggableNonFolderFile } from "@/components/custom/data/grid/draggable-non-folder-file";
import { DroppableFolderFile } from "@/components/custom/data/grid/droppable-folder-file";
import { ContextMenuContentDropdown } from "@/components/custom/data/context-menu-content-dropdown";
import { snapTopLeftToCursor } from "@/components/custom/data/modifiers/snap-top-left";
import { FileIcon } from "@/components/custom/data/file-icon";
import { Move } from "@/components/custom/data/move/move";
import { Rename } from "@/components/custom/data/rename/rename";
import { Share } from "@/components/custom/data/share/share";
import { Info } from "@/components/custom/data/info/info";

import { moveItem } from "@/services/storage";
import { customToast } from "@/lib/custom/custom-toast";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function GridView({
    items,
    starred,
    shared,
    inaccessible,
}: {
    items: Item[]
    starred?: boolean
    shared?: boolean
    inaccessible?: boolean
}) {
    const pathname = usePathname();
    const paths = pathname.split("/");
    const sourceParentId = paths.length === 4 ? paths[3] : undefined;

    const FOLDERS = items ? items.filter((file) => file.type === "FOLDER") : [];
    const NON_FOLDERS = items ? items.filter((file) => file.type === "FILE") : [];
    const ALL_FILES = [...FOLDERS, ...NON_FOLDERS];

    const [selectedItemsIdx, setSelectedItemsIdx] = useState<Set<number>>(
        () => new Set(),
    );
    const [lastSelectedFileIdx, setLastSelectedFileIdx] = useState<number>(-1);
    const [draggedFileIdx, setDraggedFileIdx] = useState<number>(-1);
    const [openMoveDialog, setOpenMoveDialog] = useState<boolean>(false);
    const [openRenameDialog, setOpenRenameDialog] = useState<boolean>(false);
    const [openShareDialog, setOpenShareDialog] = useState<boolean>(false);
    const [openInfoSheet, setOpenInfoSheet] = useState<boolean>(false);

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

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (contextMenuRef.current && contextMenuRef.current.contains(event.target as Node)) {
                return;
            }

            if (ref.current && !ref.current.contains(event.target as Node) && event.button === 0) {
                setSelectedItemsIdx(() => new Set());
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const selectedFiles = selectedItemsIdx.size > 0
        ? [...selectedItemsIdx].map(idx => ALL_FILES[idx])
        : [];

    const selectFile = (idx: number) => {
        setSelectedItemsIdx((prev) => new Set(prev).add(idx));
    };

    const deselectFile = (idx: number) => {
        setSelectedItemsIdx((prev) => {
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
            setLastSelectedFileIdx(idx);

            if (selectedItemsIdx.has(idx)) {
                deselectFile(idx);
            } else {
                selectFile(idx);
            }

            return;
        }

        if (event.shiftKey) {
            const start = Math.min(lastSelectedFileIdx, idx);
            const end = Math.max(lastSelectedFileIdx, idx);

            for (let i = 0; i < ALL_FILES.length; i++) {
                if (start <= i && i <= end) {
                    selectFile(i);
                } else {
                    deselectFile(i);
                }
            }

            return;
        }

        setLastSelectedFileIdx(idx);
        setSelectedItemsIdx(() => new Set<number>().add(idx));
    };

    const handleRightClick = (idx: number) => {
        if (selectedItemsIdx.size === 0) {
            setLastSelectedFileIdx(idx);
            setSelectedItemsIdx(() => new Set<number>().add(idx));
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setDraggedFileIdx(event.active.id as number);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setDraggedFileIdx(-1);

        const over = event.over;
        if (over && selectedFiles.length > 0) {
            try {
                await Promise.all(selectedFiles.map(async (file) => await moveItemMutation.mutateAsync({
                    itemId: file.id,
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
                
                const message = selectedFiles.length > 1
                    ? `Moved ${selectedFiles.length} items.`
                    : `Moved ${selectedFiles[0].name}.`;

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
                setSelectedItemsIdx(() => new Set());
            }
        }
    };

    if (items.length === 0) {
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

        if (shared) {
            return (
                <section className="flex justify-center">
                    <span className="text-sm text-zinc-400"> No shared items found. </span>
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
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    {(starred || shared || inaccessible) &&
                        <div
                            ref={ref}
                            className="flex flex-col h-full gap-8 overflow-y-auto select-none"
                        >
                            {FOLDERS.length > 0 &&
                                <section className="flex flex-col gap-4">
                                    <span> Folders </span>
                                    <div className="flex flex-wrap gap-4">
                                        {FOLDERS.map((file, i) =>
                                            selectedItemsIdx.has(i) ? (
                                                <DraggableFolderFile
                                                    key={i}
                                                    idx={i}
                                                    file={file}
                                                    draggedFileIdx={draggedFileIdx}
                                                    handleLeftClick={handleLeftClick}
                                                    handleRightClick={handleRightClick}
                                                    inaccessible={inaccessible}
                                                />
                                            ) : draggedFileIdx >= 0 && !file.contentType ? (
                                                    <DroppableFolderFile
                                                        key={file.id}
                                                        file={file}
                                                    />
                                                ) : (
                                                    <StaticFolderFile
                                                        key={file.id}
                                                        idx={i}
                                                        file={file}
                                                        handleLeftClick={handleLeftClick}
                                                        handleRightClick={handleRightClick}
                                                        inaccessible={inaccessible}
                                                    />
                                                ),
                                            )
                                        }
                                    </div>
                                </section>
                            }
                            {NON_FOLDERS.length > 0 &&
                                <section className="flex flex-col gap-4">
                                    <span> Files </span>
                                    <div className="flex flex-wrap gap-4">
                                        {NON_FOLDERS.map((file, i) =>
                                            selectedItemsIdx.has(i + FOLDERS.length) ? (
                                                <DraggableNonFolderFile
                                                    key={file.id}
                                                    idx={i + FOLDERS.length}
                                                    file={file}
                                                    draggedFileIdx={draggedFileIdx}
                                                    handleLeftClick={handleLeftClick}
                                                    handleRightClick={handleRightClick}
                                                />
                                            ) : (
                                                <StaticNonFolderFile
                                                    key={file.id}
                                                    idx={i + FOLDERS.length}
                                                    file={file}
                                                    handleLeftClick={handleLeftClick}
                                                    handleRightClick={handleRightClick}
                                                />
                                            ),
                                        )}
                                    </div>
                                </section>
                            }
                        </div>
                    }
                    {!(starred || shared || inaccessible) &&
                        <DndContext
                            sensors={sensors}
                            collisionDetection={pointerWithin}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <div
                                ref={ref}
                                className="flex flex-col h-[70dvh] lg:h-[75dvh] gap-8 overflow-y-scroll select-none"
                            >
                                {FOLDERS.length > 0 &&
                                    <section className="flex flex-col gap-4">
                                        <span> Folders </span>
                                        <div className="flex flex-wrap gap-4">
                                            {FOLDERS.map((file, i) =>
                                                selectedItemsIdx.has(i) ? (
                                                    <DraggableFolderFile
                                                        key={i}
                                                        idx={i}
                                                        file={file}
                                                        draggedFileIdx={draggedFileIdx}
                                                        handleLeftClick={handleLeftClick}
                                                        handleRightClick={handleRightClick}
                                                    />
                                                ) : draggedFileIdx >= 0 && !file.contentType ? (
                                                        <DroppableFolderFile
                                                            key={file.id}
                                                            file={file}
                                                        />
                                                    ) : (
                                                        <StaticFolderFile
                                                            key={file.id}
                                                            idx={i}
                                                            file={file}
                                                            handleLeftClick={handleLeftClick}
                                                            handleRightClick={handleRightClick}
                                                        />
                                                    ),
                                                )
                                            }
                                        </div>
                                    </section>
                                }
                                {NON_FOLDERS.length > 0 &&
                                    <section className="flex flex-col gap-4">
                                        <span> Files </span>
                                        <div className="flex flex-wrap gap-4">
                                            {NON_FOLDERS.map((file, i) =>
                                                selectedItemsIdx.has(i + FOLDERS.length) ? (
                                                    <DraggableNonFolderFile
                                                        key={file.id}
                                                        idx={i + FOLDERS.length}
                                                        file={file}
                                                        draggedFileIdx={draggedFileIdx}
                                                        handleLeftClick={handleLeftClick}
                                                        handleRightClick={handleRightClick}
                                                    />
                                                ) : (
                                                    <StaticNonFolderFile
                                                        key={file.id}
                                                        idx={i + FOLDERS.length}
                                                        file={file}
                                                        handleLeftClick={handleLeftClick}
                                                        handleRightClick={handleRightClick}
                                                    />
                                                ),
                                            )}
                                        </div>
                                    </section>
                                }
                                <DragOverlay
                                    modifiers={[
                                        snapTopLeftToCursor,
                                        restrictToWindowEdges,
                                    ]}
                                    className="max-h-[50px] max-w-[150px] rounded-lg bg-zinc-950 shadow-xs shadow-zinc-600"
                                >
                                    {draggedFileIdx >= 0 && (
                                        <span className="relative flex items-center w-full h-full gap-4 px-4 text-sm">
                                            <FileIcon
                                                contentType={
                                                    ALL_FILES[draggedFileIdx].contentType
                                                }
                                                className="w-4 h-4"
                                            />
                                            <div className="flex-1 overflow-x-hidden text-ellipsis whitespace-nowrap">
                                                {ALL_FILES[draggedFileIdx].name}
                                            </div>
                                            {selectedItemsIdx.size > 1 && (
                                                <span className="absolute p-2 text-xs rounded-full -top-2 -right-2 bg-zinc-950 outline-1">
                                                    +{selectedItemsIdx.size - 1}
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </DragOverlay>
                            </div>
                        </DndContext>
                    }
                </ContextMenuTrigger>
                {selectedFiles.length > 0 &&
                    <ContextMenuContentDropdown 
                        contextMenuRef={contextMenuRef} 
                        selectedItems={selectedFiles}
                        setOpenMoveDialog={setOpenMoveDialog}
                        setOpenRenameDialog={setOpenRenameDialog}
                        setOpenShareDialog={setOpenShareDialog}
                        setOpenInfoSheet={setOpenInfoSheet}
                        setSelectedIdx={setSelectedItemsIdx}
                    />
                }
            </ContextMenu>
            <Move
                open={openMoveDialog}
                selectedItems={selectedFiles}
                setOpen={setOpenMoveDialog}
                setSelectedIdx={setSelectedItemsIdx}
            />
            <Rename 
                open={openRenameDialog}
                selectedItems={selectedFiles}
                setOpen={setOpenRenameDialog}
            />
            <Share
                open={openShareDialog}
                selectedItems={selectedFiles}
                setOpen={setOpenShareDialog}
            />
            <Info
                open={openInfoSheet}
                selectedItems={selectedFiles}
                setOpen={setOpenInfoSheet}
            />
        </>
    );
}
