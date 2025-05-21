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

import { DROPDOWN_ITEM_GROUPS } from "@/constants/data/placeholder";
import { FILES } from "@/constants/data/placeholder";

export function GridView() {
    const FOLDERS = FILES.filter((file) => file.category === undefined);
    const NON_FOLDERS = FILES.filter((file) => file.category !== undefined);
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

            for (let i = 0; i < FILES.length; i++) {
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
                        className="flex flex-col gap-8 overflow-y-auto select-none"
                        style={{ height: "calc(100vh - 200px)" }}
                    >
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
                                      file.category === "folder" ? (
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
                        <DragOverlay
                            modifiers={[
                                snapTopLeftToCursor,
                                restrictToWindowEdges,
                            ]}
                            className="max-h-[50px] max-w-[150px] rounded-lg bg-zinc-950 shadow-xs shadow-zinc-600"
                        >
                            {draggedFileIdx >= 0 && (
                                <span className="relative flex h-full w-full items-center gap-4 px-4 text-sm">
                                    <FileIcon
                                        contentType={
                                            ALL_FILES[draggedFileIdx].category
                                        }
                                        className="h-4 w-4"
                                    />
                                    {ALL_FILES[draggedFileIdx].name}
                                    {selectedFiles.size > 1 && (
                                        <span className="absolute -top-2 -right-2 rounded-full bg-zinc-950 p-2 text-xs outline-1">
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
