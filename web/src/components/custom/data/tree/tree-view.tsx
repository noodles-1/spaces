"use client"

import React, { useEffect, useRef, useState } from "react";
import { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useStorageTreeStore } from "@/zustand/providers/storage-tree-provider";

import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
    ContextMenu, 
    ContextMenuTrigger 
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { TreeItem } from "@/components/custom/data/tree/tree-item";
import { TreeViewSkeleton } from "@/components/custom/data/tree/tree-view-skeleton";

import axiosClient from "@/lib/axios-client";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";
import { formatFileSize } from "@/lib/custom/file-size";

export function TreeView() {
    const { data: rootData } = useQuery<AxiosResponse<ResponseDto<{ children: Item[] }>>>({
        queryKey: ["user-accessible-items-recursive"],
        queryFn: () => axiosClient.get("/storage/items/accessible/children/recursive")
    });
    
    const { addItem } = useStorageTreeStore(state => state);
    
    const [sortValue, setSortValue] = useState<string>("Name");
    const [isSortAscending, setSortAscending] = useState<boolean>(true);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [items, setItems] = useState<TreeViewBaseItem<{ id: string; label: string; size: number }>[] | undefined>(undefined);
    
    const [used, setUsed] = useState<number>(0);
    const capacity = Number("5e+10"); // TODO: dependent on the total storage capacity
    const percentageUsed = used / capacity * 100;
    
    const ref = useRef<HTMLElement>(null);
    
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node) && event.button === 0) {
                setSelectedItems([]);
            }
        };
        
        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, []);
    
    useEffect(() => {
        const mapRootItems = () => {
            if (!rootData) {
                return;
            }

            function dfs(item: Item): TreeViewBaseItem<{ id: string; label: string; size: number }> {
                if (!item.children || item.children.length === 0) {
                    addItem(item.id, item);
                    const res: TreeViewBaseItem<{ id: string; label: string; size: number }> = {
                        id: item.id,
                        label: item.name,
                        size: item.size ?? 0
                    };
                    
                    return res;
                }
                
                const children = item.children.map(child => dfs(child));
                const size = children.reduce((sum, currentItem) => sum + currentItem.size, 0);
                
                item.size = size;
                addItem(item.id, item);
                
                const res: TreeViewBaseItem<{ id: string; label: string; size: number }> = {
                    id: item.id,
                    label: item.name,
                    size,
                    children
                };
                
                return res;
            };
            
            const rootChildren = rootData.data.data.children[0]?.children?.map(child => dfs(child));
            const totalSize = rootChildren?.reduce((sum, currentChild) => sum + currentChild.size, 0);
            setItems(rootChildren);
            setUsed(totalSize ?? 0);
        };
        
        mapRootItems();
    }, [rootData]);
    
    const handleSelectedItemsChange = (_: React.SyntheticEvent, ids: string[]) => {
        setSelectedItems(ids);
    };
    
    const sortBySize = (sortAscending: boolean) => {
        function dfs(item: TreeViewBaseItem<{ id: string; label: string; size: number }>) {
            if (item.children) {
                if (sortAscending)
                    item.children.sort((a, b) => a.size - b.size);
                else
                    item.children.sort((a, b) => b.size - a.size);
                item.children.map(child => dfs(child));
            }
        }
        
        const sortedItems = items;
        if (sortAscending)
            sortedItems?.sort((a, b) => a.size - b.size);
        else
            sortedItems?.sort((a, b) => b.size - a.size);
        sortedItems?.map(item => dfs(item));
        
        setItems(sortedItems);
    };

    const sortByName = (sortAscending: boolean) => {
        function dfs(item: TreeViewBaseItem<{ id: string; label: string; size: number }>) {
            if (item.children) {
                if (sortAscending)
                    item.children.sort((a, b) => a.label.localeCompare(b.label));
                else
                    item.children.sort((a, b) => b.label.localeCompare(a.label));
                item.children.map(child => dfs(child));
            }
        }
        
        const sortedItems = items;
        if (sortAscending)
            sortedItems?.sort((a, b) => a.label.localeCompare(b.label));
        else
            sortedItems?.sort((a, b) => b.label.localeCompare(a.label));
        sortedItems?.map(item => dfs(item));
        
        setItems(sortedItems);
    };
    
    const handleSort = (value: string) => {
        let sortAscending = false;
        
        if (sortValue.toLowerCase() !== value.toLowerCase())
            sortAscending = true;
        else 
            sortAscending = !isSortAscending;
        
        if (value.toLowerCase() === "name")
            sortByName(sortAscending);
        else
            sortBySize(sortAscending);
        
        setSortAscending(sortAscending);
        setSortValue(value);
    };
    
    if (!rootData) {
        return <TreeViewSkeleton />;
    }
    
    return (
        <main className="flex flex-col gap-2">
            <section className="flex items-center justify-between">
                <span className="font-light"> Total storage used: <strong> {formatFileSize(used)} ({percentageUsed.toFixed(2)}%) </strong> </span>
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="text-sm"> Sort by: </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-[120px] cursor-pointer rounded-lg select-none">
                            <Button variant="outline">
                                {
                                    isSortAscending ?
                                        <ArrowUp className="w-4 h-4" />
                                    :
                                        <ArrowDown className="w-4 h-4" />
                                }
                                {sortValue}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[120px]">
                            <DropdownMenuItem 
                                className={`cursor-pointer ${sortValue.toLowerCase() === "name" && "bg-zinc-700"}`} 
                                onClick={() => handleSort("Name")}
                            > 
                                {sortValue.toLowerCase() === "name" &&
                                    (
                                        isSortAscending ?
                                            <ArrowUp className="w-4 h-4" />
                                        :
                                            <ArrowDown className="w-4 h-4" />
                                    )
                                }
                                Name
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className={`cursor-pointer ${sortValue.toLowerCase() === "size" && "bg-zinc-700"}`} 
                                onClick={() => handleSort("Size")}
                            > 
                                {sortValue.toLowerCase() === "size" &&
                                    (
                                        isSortAscending ?
                                            <ArrowUp className="w-4 h-4" />
                                        :
                                            <ArrowDown className="w-4 h-4" />
                                    )
                                }
                                Size
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </section>
            <ContextMenu>
                <ContextMenuTrigger>
                    <section ref={ref} className="overflow-y-auto">
                        <RichTreeView
                            defaultExpandedItems={["3"]}
                            items={items ?? []}
                            slots={{ item: TreeItem }}
                            selectedItems={selectedItems}
                            onSelectedItemsChange={handleSelectedItemsChange}
                            multiSelect
                        />
                    </section>
                </ContextMenuTrigger>
            </ContextMenu>
        </main>
    );
}