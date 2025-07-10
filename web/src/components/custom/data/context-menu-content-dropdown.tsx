import React, { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";

import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
    ArchiveRestore,
    ArrowLeftRight,
    CircleCheck,
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

import { fetcher } from "@/services/fetcher";
import { createItem, deleteFile, deleteItem, deleteItemPermanently, duplicateItem, restoreItem, toggleItemStarred } from "@/services/storage";
import { customToast } from "@/lib/custom/custom-toast";
import { downloadToast } from "@/lib/custom/download-toast";

import { ResponseDto } from "@/dto/response-dto";
import { DropdownItem } from "@/types/dropdown-items-type";
import { Item } from "@/types/item-type";

export function ContextMenuContentDropdown({
    contextMenuRef,
    selectedItems,
    setOpenMoveDialog,
    setOpenRenameDialog,
    setSelectedIdx,
}: {
    contextMenuRef: React.RefObject<HTMLDivElement | null>
    selectedItems: Item[]
    setOpenMoveDialog: Dispatch<SetStateAction<boolean>>
    setOpenRenameDialog: Dispatch<SetStateAction<boolean>>
    setSelectedIdx: Dispatch<SetStateAction<Set<number>>>
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

    const deleteItemPermanentlyMutation = useMutation({
        mutationFn: deleteItemPermanently
    });

    const createItemMutation = useMutation({
        mutationFn: createItem
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
                    icon: <CircleCheck className="w-4 h-4" color="white" />,
                    message: `${selectedItem.name} has been removed from starred items.`,
                });
            }
            else {
                customToast({
                    icon: <CircleCheck className="w-4 h-4" color="white" />,
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

            queryClient.invalidateQueries({
                queryKey: ["user-accessible-items-recursive"]
            });
            
            const message = selectedItems.length > 1
                ? `Moved ${selectedItems.length} items into the trash.`
                : `Moved ${selectedItems[0].name} into the trash.`;

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

            queryClient.invalidateQueries({
                queryKey: ["user-accessible-items-recursive"]
            });
            
            const message = selectedItems.length > 1
                ? `Restored ${selectedItems.length} items from the trash.`
                : `Restored ${selectedItems[0].name} from the trash.`;

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

    const handleDeletePermanently = async () => {
        function dfs(item: Item) {
            if (item.type === "FILE") {
                deleteFile({ file: item });
            }
            else {
                if (item.children) {
                    item.children.map(child => dfs(child));
                }
            }
        }

        try {
            const files = selectedItems.filter(selectedItem => selectedItem.type === "FILE");
            const folders = selectedItems.filter(selectedItem => selectedItem.type === "FOLDER");
            const foldersResponse = await Promise.all(folders.map(async (folder) => await fetcher<{ children: Item[] }>(`/storage/items/inaccessible/children/recursive/${folder.id}`)));
            
            files.map(file => deleteFile({ file }));
            foldersResponse.map(folderResponse => {
                if (folderResponse.data.children.length > 0) {
                    folderResponse.data.children[0].children?.map(child => dfs(child));
                }
            });
            
            await Promise.all(selectedItems.map(async (item) => await deleteItemPermanentlyMutation.mutateAsync({
                itemId: item.id
            })));

            const message = selectedItems.length > 1
            ? `Permanently deleted ${selectedItems.length} items.`
            : `Permanently deleted ${selectedItems[0].name}.`;
            
            queryClient.invalidateQueries({
                queryKey: ["user-inaccessible-items"]
            });

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
            setSelectedIdx(() => new Set());
        }
    };

    const handleDuplicate = async () => {
        async function dfs(item: Item, parentId?: string) {
            if (item.type === "FILE") {
                const duplicateFile = await createItemMutation.mutateAsync({
                    name: item.name,
                    type: "FILE",
                    parentId,
                    contentType: item.contentType,
                    size: item.size,
                });

                await duplicateItem({
                    sourceKey: item.id,
                    destinationKey: duplicateFile.data.item.id,
                });
            }
            else {
                const duplicateFolder = await createItemMutation.mutateAsync({
                    name: item.name,
                    type: "FOLDER",
                    parentId,
                });

                if (item.children) {
                    await Promise.all(item.children.map(async (child) => await dfs(child, duplicateFolder.data.item.id)));
                }
            }
        }

        try {
            const files = selectedItems.filter(selectedItem => selectedItem.type === "FILE");
            const folders = selectedItems.filter(selectedItem => selectedItem.type === "FOLDER");
            const foldersResponse = await Promise.all(folders.map(async (folder) => await fetcher<{ children: Item[] }>(`/storage/items/children/recursive/${folder.id}`)));
            
            await Promise.all(files.map(async (file) => {
                const slices = file.name.split(".");
                const filename = slices.slice(0, slices.length - 1).join(".");
                const fileExtension = slices.slice(-1)[0];

                const duplicateFile = await createItemMutation.mutateAsync({
                    name: `${filename} - copy.${fileExtension}`,
                    type: "FILE",
                    parentId: sourceParentId,
                    contentType: file.contentType,
                    size: file.size,
                });

                await duplicateItem({
                    sourceKey: file.id,
                    destinationKey: duplicateFile.data.item.id,
                });
            }));

            await Promise.all(folders.map(async (folder) => {
                const duplicateFolder = await createItemMutation.mutateAsync({
                    name: `${folder.name} - copy`,
                    type: "FOLDER",
                    parentId: sourceParentId,
                });

                await Promise.all(foldersResponse.map(async (folderResponse) => {
                    if (folderResponse.data.children.length > 0) {
                        folderResponse.data.children[0].children?.map(async (child) => await dfs(child, duplicateFolder.data.item.id));
                    }
                }));
            }));

            const message = selectedItems.length > 1
            ? `Duplicated ${selectedItems.length} items.`
            : `Duplicated ${selectedItems[0].name}.`;
            
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
                queryKey: ["user-accessible-items-recursive"]
            });

            customToast({
                icon: <CircleCheck className="w-4 h-4" color="white" />,
                message,
            });
        }
        catch (error) {
            console.log(error);
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
                onClick: () => {requestAnimationFrame(() => setOpenRenameDialog(true))},
            },
            {
                id: "DUPLICATE",
                label: "Duplicate",
                icon: <Copy />,
                onClick: handleDuplicate,
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
                onClick: () => {requestAnimationFrame(() => setOpenMoveDialog(true))},
            },
            {
                id: "RESTORE",
                label: "Restore",
                icon: <ArchiveRestore />,
                onClick: handleRestore,
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
                id: "DELETE",
                label: "Delete permanently",
                icon: <Trash className="stroke-red-300" />,
                onClick: handleDeletePermanently
            }
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

                                if (paths[2] === "trash" && !["RESTORE", "INFO", "DELETE"].includes(item.id)) {
                                    return;
                                }

                                if (paths[2] !== "trash" && ["RESTORE", "INFO", "DELETE"].includes(item.id)) {
                                    return;
                                }

                                if (["ADD_STARRED", "REMOVE_STARRED"].includes(item.id) && selectedItems.length !== 1) {
                                    return;
                                }

                                if (item.id === "ADD_STARRED" && selectedItems.length === 1 && selectedItems[0].starred) {
                                    return;
                                }

                                if (item.id === "REMOVE_STARRED" && selectedItems.length === 1 && !selectedItems[0].starred) {
                                    return;
                                }

                                if (item.id === "RENAME" && selectedItems.length > 1) {
                                    return;
                                }
                                
                                return (
                                    <ContextMenuItem
                                        key={j}
                                        className={`flex gap-3 pr-12 hover:cursor-pointer ${item.id === "DELETE" && "text-red-300"}`}
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
