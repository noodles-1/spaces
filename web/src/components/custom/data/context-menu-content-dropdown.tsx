import React from "react";
import { usePathname } from "next/navigation";

import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    ArchiveRestore,
    ArrowLeftRight,
    CircleX,
    Copy,
    Download,
    FolderInput,
    Info,
    PenLine,
    Star,
    Trash,
} from "lucide-react";

import { useDownloadStore } from "@/zustand/providers/download-store-provider";

import {
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator,
} from "@/components/ui/context-menu";

import { deleteItem, restoreItem, toggleItemStarred } from "@/services/storage";
import { customToast } from "@/lib/custom/custom-toast";
import { downloadToast } from "@/lib/custom/download-toast";

import { ResponseDto } from "@/dto/response-dto";
import { DropdownItem } from "@/types/dropdown-items-type";
import { Item } from "@/types/item-type";

export function ContextMenuContentDropdown({
    contextMenuRef,
    selectedItems,
    setSelectedIdx,
}: {
    contextMenuRef: React.RefObject<HTMLDivElement | null>
    selectedItems: Item[]
    setSelectedIdx: (value: React.SetStateAction<Set<number>>) => void
}) {
    const { downloads, addFile } = useDownloadStore(state => state);

    const pathname = usePathname();
    const paths = pathname.split("/");
    const sourceParentId = paths.length === 4 ? paths[3] : undefined;

    const queryClient = useQueryClient();
    
    const toggleItemStarredMutation = useMutation({
        mutationFn: toggleItemStarred
    });
    
    const deleteItemMutation = useMutation({
        mutationFn: deleteItem
    });

    const restoreItemMutation = useMutation({
        mutationFn: restoreItem
    });

    const handleStarred = async () => {
        try {
            const selectedItem = selectedItems[0];
            
            await toggleItemStarredMutation.mutateAsync({
                itemId: selectedItem.id
            });

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
                queryKey: ["user-accessible-starred-items"]
            });

            if (selectedItem.starred) {
                customToast({
                    icon: <Star className="w-4 h-4" color="white" />,
                    message: `${selectedItem.name} has been removed from starred items.`,
                });
            }
            else {
                customToast({
                    icon: <Star className="w-4 h-4 fill-white" color="white" />,
                    message: `${selectedItem.name} has been added to starred items.`,
                });
            }
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
            setSelectedIdx(() => new Set());
        }
    };

    const handleDelete = async () => {
        try {
            await Promise.all(selectedItems.map(item => deleteItemMutation.mutateAsync({
                itemId: item.id,
                sourceParentId
            })));

            if (sourceParentId) {
                queryClient.invalidateQueries({
                    queryKey: ["user-accessible-items", sourceParentId]
                });
            }
            else if (paths[2] === "home") {
                queryClient.invalidateQueries({
                    queryKey: ["user-accessible-items"]
                });
            }
            else if (paths[2] === "starred") {
                queryClient.invalidateQueries({
                    queryKey: ["user-accessible-starred-items"]
                });
            }

            queryClient.invalidateQueries({
                queryKey: ["user-inaccessible-items"]
            });
            
            const message = selectedItems.length > 1
                ? `Moved ${selectedItems.length} items into the trash.`
                : `Moved ${selectedItems[0].name} into the trash.`;

            customToast({
                icon: <Trash className="w-4 h-4" color="white" />,
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
            setSelectedIdx(() => new Set());
        }
    };

    const handleRestore = async () => {
        try {
            await Promise.all(selectedItems.map(item => restoreItemMutation.mutateAsync({
                itemId: item.id
            })));

            selectedItems.map(item => {
                if (item.accessibleParentId) {
                    queryClient.invalidateQueries({
                        queryKey: ["user-accessible-items", item.accessibleParentId]
                    });
                }

                if (item.starred) {
                    queryClient.invalidateQueries({
                        queryKey: ["user-accessible-starred-items"]
                    });
                }
            });

            queryClient.invalidateQueries({
                queryKey: ["user-accessible-items"]
            });

            queryClient.invalidateQueries({
                queryKey: ["user-inaccessible-items"]
            });
            
            const message = selectedItems.length > 1
                ? `Restored ${selectedItems.length} items from the trash.`
                : `Restored ${selectedItems[0].name} from the trash.`;

            customToast({
                icon: <ArchiveRestore className="w-4 h-4" color="white" />,
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
            setSelectedIdx(() => new Set());
        }
    };

    const handleDownload = async () => {
        try {
            if (downloads.length === 0)
                downloadToast();

            selectedItems.map(item => addFile(item));
        }
        catch (error) {
            const axiosError = error as AxiosError;
            const data = axiosError.response?.data as ResponseDto;

            customToast({
                icon: <CircleX className="w-4 h-4" color="white" />,
                message: data.message
            });
        }
    };

    const itemGroups: DropdownItem[][] = [
        [
            {
                id: "DOWNLOAD",
                label: "Download",
                icon: <Download />,
                onClick: handleDownload,
            },
            {
                id: "RENAME",
                label: "Rename",
                icon: <PenLine />,
                onClick: () => {},
            },
            {
                id: "DUPLICATE",
                label: "Duplicate",
                icon: <Copy />,
                onClick: () => {},
            },
        ],
        [
            {
                id: "ADD_STARRED",
                label: "Add to starred",
                icon: <Star />,
                onClick: handleStarred,
            },
            {
                id: "REMOVE_STARRED",
                label: "Remove from starred",
                icon: <Star className="fill-white" />,
                onClick: handleStarred,
            },
            {
                id: "CONVERT",
                label: "Convert",
                icon: <ArrowLeftRight />,
                onClick: () => {},
            },
            {
                id: "MOVE",
                label: "Move",
                icon: <FolderInput />,
                onClick: () => {},
            },
            {
                id: "INFO",
                label: "Folder information",
                icon: <Info />,
                onClick: () => {},
            },
        ],
        [
            {
                id: "TRASH",
                label: "Move to trash",
                icon: <Trash />,
                onClick: handleDelete,
            },
            {
                id: "RESTORE",
                label: "Restore",
                icon: <ArchiveRestore />,
                onClick: handleRestore,
            },
        ],
    ];

    return (
        <ContextMenuContent ref={contextMenuRef} className="bg-zinc-950">
            <div>
                {itemGroups.map((group, i) => (
                    <section key={i}>
                        <ContextMenuGroup className="space-y-2 p-1">
                            {group.map((item, j) => {
                                if (!selectedItems) {
                                    return;
                                }

                                if (paths[2] === "trash" && !["RESTORE", "INFO"].includes(item.id)) {
                                    return;
                                }

                                if (["ADD_STARRED", "REMOVE_STARRED"].includes(item.id) && selectedItems.length !== 1) {
                                    return;
                                }

                                if (item.id === "ADD_STARRED" && selectedItems.length === 1 && selectedItems[0].starred) {
                                    return;
                                }

                                if (item.id === "REMOVE_STARRED" && selectedItems.length === 1 && !selectedItems[0].starred) {
                                    return
                                }
                                
                                if (item.id === "TRASH" && paths[2] === "trash") {
                                    return;
                                }

                                if (item.id === "RESTORE" && paths[2] !== "trash") {
                                    return;
                                }

                                return (
                                    <ContextMenuItem
                                        key={j}
                                        className="flex gap-3 pr-12 hover:cursor-pointer"
                                        onClick={() => item.onClick()}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </ContextMenuItem>
                                )
                            })}
                        </ContextMenuGroup>
                        {i < itemGroups.length - 1 && paths[2] !== "trash" && <ContextMenuSeparator />}
                    </section>
                ))}
            </div>
        </ContextMenuContent>
    );
}
