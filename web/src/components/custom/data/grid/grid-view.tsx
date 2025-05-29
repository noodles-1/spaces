import React, { useEffect, useRef, useState } from "react";

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

import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { StaticFolderFile } from "@/components/custom/data/grid/static-folder-file";
import { StaticNonFolderFile } from "@/components/custom/data/grid/static-non-folder-file";
import { DraggableFolderFile } from "@/components/custom/data/grid/draggable-folder-file";
import { DraggableNonFolderFile } from "@/components/custom/data/grid/draggable-non-folder-file";
import { DroppableFolderFile } from "@/components/custom/data/grid/droppable-folder-file";
import { ContextMenuContentDropdown } from "@/components/custom/data/context-menu-content-dropdown";
import { snapTopLeftToCursor } from "@/components/custom/data/modifiers/snap-top-left";
import { FileIcon } from "@/components/custom/data/file-icon";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

import { DROPDOWN_ITEM_GROUPS } from "@/constants/data/placeholder";

export function GridView({
    userItems
}: {
    userItems: ResponseDto<{ children: Item[] }>
}) {
    const FOLDERS = userItems.data.children.filter((file) => file.type === "FOLDER");
    const NON_FOLDERS = userItems.data.children.filter((file) => file.type === "FILE");
    const ALL_FILES = [...FOLDERS, ...NON_FOLDERS];

    const [selectedFiles, setSelectedFiles] = useState<Set<number>>(
        () => new Set(),
    );
    const [lastSelectedFileIdx, setLastSelectedFileIdx] = useState<number>(-1);
    const [draggedFileIdx, setDraggedFileIdx] = useState<number>(-1);

    const ref = useRef<HTMLDivElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 40,
            },
        }),
    );

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node) &&
                event.button === 0
            ) {
                setSelectedFiles(() => new Set());
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const selectFile = (idx: number) => {
        setSelectedFiles((prev) => new Set(prev).add(idx));
    };

    const deselectFile = (idx: number) => {
        setSelectedFiles((prev) => {
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

            if (selectedFiles.has(idx)) {
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
        setSelectedFiles(() => new Set<number>().add(idx));
    };

    const handleRightClick = (idx: number) => {
        if (selectedFiles.size === 0) {
            setLastSelectedFileIdx(idx);
            setSelectedFiles(() => new Set<number>().add(idx));
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setDraggedFileIdx(event.active.id as number);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setDraggedFileIdx(-1);

        if (event.over) {
            console.log(event.over.id);
        }
    };

    if (userItems.data.children.length === 0) {
        return (
            <section className="flex justify-center">
                <span className="text-sm text-zinc-400"> No items found. Upload files by dragging them into this section. </span>
            </section>
        );
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <DndContext
                    sensors={sensors}
                    collisionDetection={pointerWithin}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div
                        ref={ref}
                        className="flex flex-col h-full gap-8 overflow-y-auto select-none"
                    >
                        {FOLDERS.length > 0 &&
                            <section className="flex flex-col gap-4">
                                <span> Folders </span>
                                <div className="flex flex-wrap gap-4">
                                    {FOLDERS.map((file, i) =>
                                        selectedFiles.has(i) ? (
                                            <DraggableFolderFile
                                                key={i}
                                                idx={i}
                                                file={file}
                                                draggedFileIdx={draggedFileIdx}
                                                handleLeftClick={handleLeftClick}
                                                handleRightClick={handleRightClick}
                                            />
                                        ) : draggedFileIdx >= 0 &&
                                        !file.contentType ? (
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
                                    )}
                                </div>
                            </section>
                        }
                        {NON_FOLDERS.length > 0 &&
                            <section className="flex flex-col gap-4">
                                <span> Files </span>
                                <div className="flex flex-wrap gap-4">
                                    {NON_FOLDERS.map((file, i) =>
                                        selectedFiles.has(i + FOLDERS.length) ? (
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
                                    {selectedFiles.size > 1 && (
                                        <span className="absolute p-2 text-xs rounded-full -top-2 -right-2 bg-zinc-950 outline-1">
                                            +{selectedFiles.size - 1}
                                        </span>
                                    )}
                                </span>
                            )}
                        </DragOverlay>
                    </div>
                </DndContext>
            </ContextMenuTrigger>
            {selectedFiles.size > 0 ? (
                <ContextMenuContentDropdown itemGroups={DROPDOWN_ITEM_GROUPS} />
            ) : (
                <ContextMenuContentDropdown />
            )}
        </ContextMenu>
    );
}
