import React, { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";

import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    ArchiveRestore,
    CircleCheck,
    CircleX,
    Copy,
    Download,
    FolderInput,
    Info,
    Loader2,
    PenLine,
    Star,
    Trash,
    UserPlus,
} from "lucide-react";

import { useDownloadStore } from "@/zustand/providers/download-store-provider";

import {
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator,
} from "@/components/ui/context-menu";

import { fetcher } from "@/services/fetcher";
import { createItem, deleteFile, deleteItem, deleteItemPermanently, duplicateItem, restoreItem } from "@/services/storage";
import { toggleItemStarred } from "@/services/starred";
import { customToast } from "@/lib/custom/custom-toast";
import { downloadToast } from "@/lib/custom/download-toast";
import axiosClient from "@/lib/axios-client";

import { ResponseDto } from "@/dto/response-dto";
import { DropdownItem } from "@/types/dropdown-items-type";
import { Item } from "@/types/item-type";
import { UserResponse } from "@/types/response/user-type";
import { UserPermission } from "@/types/user-permission-type";

export function ContextMenuContentDropdown({
    contextMenuRef,
    selectedItems,
    setOpenMoveDialog,
    setOpenRenameDialog,
    setOpenShareDialog,
    setSelectedIdx,
}: {
    contextMenuRef: React.RefObject<HTMLDivElement | null>
    selectedItems: Item[]
    setOpenMoveDialog: Dispatch<SetStateAction<boolean>>
    setOpenRenameDialog: Dispatch<SetStateAction<boolean>>
    setOpenShareDialog: Dispatch<SetStateAction<boolean>>
    setSelectedIdx: Dispatch<SetStateAction<Set<number>>>
}) {
    const { downloads, addFile } = useDownloadStore(state => state);

    const pathname = usePathname();
    const paths = pathname.split("/");
    const sourceParentId = paths.length === 4 ? paths[3] : undefined;

    const firstSelectedItem = selectedItems[0];

    const { data: ownerUserIdData } = useQuery<AxiosResponse<ResponseDto<{ ownerUserId: string | null }>>>({
        queryKey: ["item-owner-id", firstSelectedItem.id],
        queryFn: () => axiosClient.get(`/storage/items/public/owner-user-id/${firstSelectedItem.id}`)
    });

    const { data: permissionData } = useQuery<AxiosResponse<ResponseDto<{ permission: UserPermission | null }>>>({
        queryKey: ["current-user-permission", firstSelectedItem.id],
        queryFn: () => axiosClient.get(`/storage/permissions/public/permission/${firstSelectedItem.id}`)
    });

    const { data: currentUserData } = useQuery<AxiosResponse<ResponseDto<{ user: UserResponse | null }>>>({
        queryKey: ["current-user"],
        queryFn: () => axiosClient.get("/user/users/me")
    });

    const { data: starredExistsData } = useQuery<AxiosResponse<ResponseDto<{ exists: boolean }>>>({
        queryKey: ["starred-item-exists", firstSelectedItem.id],
        queryFn: () => axiosClient.get(`/storage/starred/public/check-exists/${firstSelectedItem.id}`)
    });

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

    if (!(ownerUserIdData && permissionData && currentUserData && starredExistsData)) {
        return (
            <ContextMenuContent ref={contextMenuRef} className="bg-zinc-950">
                <div className="w-full flex items-center justify-center p-4">
                    <Loader2 className="animate-spin" />
                </div>
            </ContextMenuContent>
        );
    }

    const ownerUserId = ownerUserIdData.data.data.ownerUserId;
    const permission = permissionData.data.data.permission;
    const currentUser = currentUserData.data.data.user;
    
    const isOwner = !["starred", "shared"].includes(paths[2]) && (paths[2] === "home" || currentUser?.id === ownerUserId);
    const isEditor = !["starred", "shared"].includes(paths[2]) && ((currentUser?.id === permission?.userId) && permission?.type === "EDIT");
    
    const isStarred = starredExistsData.data.data.exists;

    const handleStarred = async () => {
        try {
            await toggleItemStarredMutation.mutateAsync({
                itemId: firstSelectedItem.id
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

            queryClient.invalidateQueries({
                queryKey: ["starred-item-exists", firstSelectedItem.id]
            });

            if (isStarred) {
                customToast({
                    icon: <CircleCheck className="w-4 h-4" color="white" />,
                    message: `${firstSelectedItem.name} has been removed from starred items.`,
                });
            }
            else {
                customToast({
                    icon: <CircleCheck className="w-4 h-4" color="white" />,
                    message: `${firstSelectedItem.name} has been added to starred items.`,
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
            });
            
            queryClient.invalidateQueries({
                queryKey: ["user-accessible-starred-items"]
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
                id: "SHARE",
                label: "Share",
                icon: <UserPlus />,
                onClick: () => {requestAnimationFrame(() => setOpenShareDialog(true))},
            },
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

    const filteredItemGroups: DropdownItem[][] = [];
    itemGroups.map(itemGroup => {
        const newItemGroup = itemGroup.filter(item => {
            if (!selectedItems) {
                return false;
            }

            if (paths[2] === "trash" && !["RESTORE", "INFO", "DELETE"].includes(item.id)) {
                return false;
            }

            if (paths[2] !== "trash" && ["RESTORE", "DELETE"].includes(item.id)) {
                return false;
            }

            if (["ADD_STARRED", "REMOVE_STARRED", "SHARE"].includes(item.id) && selectedItems.length !== 1) {
                return false;
            }

            if (item.id === "ADD_STARRED" && selectedItems.length === 1 && isStarred) {
                return false;
            }

            if (item.id === "REMOVE_STARRED" && selectedItems.length === 1 && !isStarred) {
                return false;
            }

            if (["RENAME", "INFO"].includes(item.id) && selectedItems.length > 1) {
                return false;
            }

            if (!isOwner && !isEditor && ["RENAME", "DUPLICATE", "SHARE", "MOVE", "TRASH"].includes(item.id)) {
                return false;
            }

            if (!currentUser && ["ADD_STARRED", "REMOVE_STARRED"].includes(item.id)) {
                return false;
            }

            return true;
        });

        if (newItemGroup.length > 0) {
            filteredItemGroups.push(newItemGroup);
        }
    });

    return (
        <ContextMenuContent ref={contextMenuRef} className="bg-zinc-950">
            <div>
                {filteredItemGroups.map((group, i) => (
                    <section key={i}>
                        <ContextMenuGroup className="space-y-2 p-1">
                            {group.map((item, j) => 
                                <ContextMenuItem
                                    key={j}
                                    className={`flex gap-3 pr-12 hover:cursor-pointer ${item.id === "DELETE" && "text-red-300"}`}
                                    onClick={() => item.onClick()}
                                >
                                    {item.icon}
                                    {item.label}
                                </ContextMenuItem>
                            )}
                        </ContextMenuGroup>
                        {i < filteredItemGroups.length - 1 && <ContextMenuSeparator />}
                    </section>
                ))}
            </div>
        </ContextMenuContent>
    );
}
