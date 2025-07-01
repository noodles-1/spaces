"use client"

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { AxiosError } from "axios";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { ArchiveRestore, CircleX, Loader2 } from "lucide-react";

import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";

import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoveTreeItem } from "@/components/custom/data/move/move-tree-item";

import { fetcher } from "@/services/fetcher";
import { moveItem } from "@/services/storage";

import { customToast } from "@/lib/custom/custom-toast";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function MoveTreeView({
    selectedFolderId,
    selectedItems,
    setSelectedFolderId,
    setSelectedItemsIdx,
    setOpen
}: {
    selectedFolderId: string | null
    selectedItems: Item[]
    setSelectedFolderId: Dispatch<SetStateAction<string | null>>
    setSelectedItemsIdx: Dispatch<SetStateAction<Set<number>>>
    setOpen: Dispatch<SetStateAction<boolean>>
}) {
    const pathname = usePathname();
    const paths = pathname.split("/");
    const sourceParentId = paths.length === 4 ? paths[3] : undefined;

    const selectedItemsIdSet = new Set(selectedItems.map(item => item.id));

    const { data: rootData } = useSuspenseQuery<ResponseDto<{ children: Item[] }>>({
        queryKey: ["user-accessible-items-recursive"],
        queryFn: () => fetcher("/storage/items/accessible/children/recursive")
    });

    const [rootItems, setRootItems] = useState<TreeViewBaseItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const ref = useRef<HTMLElement>(null);
    const selectedItemsRef = useRef<Item[]>([]);

    const queryClient = useQueryClient();
    const moveItemMutation = useMutation({
        mutationFn: moveItem
    });

    const handleMove = async () => {
        if (selectedItemsRef.current.length > 0 && selectedFolderId) {
            try {
                setLoading(true);

                const destinationParentId = selectedFolderId === "HOME" ? undefined : selectedFolderId;

                await Promise.all(selectedItemsRef.current.map(async (file) => await moveItemMutation.mutateAsync({
                    itemId: file.id,
                    sourceParentId,
                    destinationParentId
                })));

                queryClient.invalidateQueries({
                    queryKey: ["user-accessible-items-recursive"]
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

                if (destinationParentId) {
                    queryClient.invalidateQueries({
                        queryKey: ["user-accessible-items", destinationParentId]
                    });
                }
                else {
                    queryClient.invalidateQueries({
                        queryKey: ["user-accessible-items"]
                    });
                }

                
                const message = selectedItemsRef.current.length > 1
                    ? `Moved ${selectedItemsRef.current.length} items.`
                    : `Moved ${selectedItemsRef.current[0].name}.`;
                    
                customToast({
                    icon: <ArchiveRestore className="w-4 h-4" color="white" />,
                    message,
                });

                setOpen(false);
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

    useEffect(() => {
        selectedItemsRef.current = selectedItems;

        const handleOutsideClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node) && event.button === 0) {
                setSelectedFolderId(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        const mapRootItems = () => {
            function dfs(item: Item): TreeViewBaseItem {
                const children = item.children?.filter(child => child.type === "FOLDER" && !selectedItemsIdSet.has(child.id)).map(child => dfs(child));
                return {
                    id: item.id,
                    label: item.name,
                    children
                };
            }
            
            const rootChildren = rootData.data.children[0].children?.filter(child => child.type === "FOLDER" && !selectedItemsIdSet.has(child.id)).map(child => dfs(child));
            const temp: TreeViewBaseItem[] = [
                {
                    id: "HOME",
                    label: "Home",
                    children: rootChildren
                },
                {
                    id: "SHARED",
                    label: "Shared folders",
                },
            ];
            setRootItems(temp);
        };

        mapRootItems();

        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleSelectedItemChange = (_: React.SyntheticEvent, id: string | null) => {
        setSelectedFolderId(id);
    };

    return (
        <main ref={ref}>
            {selectedItemsRef.current.length > 0 &&
                <span className="text-[14px] text-zinc-300"> 
                    Item to move: 
                    <span className="font-semibold"> {selectedItemsRef.current[0].name} </span>
                </span>
            }
            <main className="h-[24rem] overflow-auto pt-2">
                <section className="flex flex-col gap-2">
                    <section className="overflow-y-auto">
                        <RichTreeView
                            defaultExpandedItems={["3"]}
                            items={rootItems}
                            slots={{ item: MoveTreeItem }}
                            selectedItems={selectedFolderId}
                            onSelectedItemsChange={handleSelectedItemChange}
                        />
                    </section>
                </section>
            </main>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="link" className="cursor-pointer text-spaces-tertiary" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogClose>
                <Button 
                    className="cursor-pointer" 
                    disabled={loading || !selectedFolderId || (selectedFolderId !== null && selectedFolderId === "SHARED")}
                    onClick={handleMove}
                >
                    {loading && <Loader2 className="animate-spin"/>}
                    {loading ?
                        "Moving..."
                    :
                        "Move"
                    }
                </Button>
            </DialogFooter>
        </main>
    );
}