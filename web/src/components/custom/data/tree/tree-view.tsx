"use client"

import React, { useEffect, useRef, useState } from "react";

import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";

import { ArrowUpDown } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { 
    ContextMenu, 
    ContextMenuTrigger 
} from "@/components/ui/context-menu";

import { ContextMenuContentDropdown } from "@/components/custom/data/context-menu-content-dropdown";
import { TreeItem } from "@/components/custom/data/tree/tree-item";

import { DROPDOWN_ITEM_GROUPS } from "@/constants/data/placeholder";

const ITEMS: TreeViewBaseItem[] = [
    {
        id: "1",
        label: "Amelia Hart",
        children: [{ id: "2", label: "Jane Fisher" }],
    },
    {
        id: "3",
        label: "Bailey Monroe",
        children: [
            { id: "4", label: "Freddie Reed" },
            {
                id: "5",
                label: "Georgia Johnson",
                children: [{ id: "6", label: "Samantha Malone" }],
            },
        ],
    },
];

export function TreeView() {
    const [sortValue, setSortValue] = useState<string>("size");
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node) &&
                event.button === 0
            ) {
                setSelectedItems([]);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleSelectedItemsChange = (_: React.SyntheticEvent, ids: string[]) => {
        setSelectedItems(ids);
    };

    console.log(selectedItems)

    return (
        <main className="flex flex-col gap-2">
            <section className="flex items-center justify-between">
                <span className="font-light"> Total storage used: <strong> 14 GB (10%) </strong> </span>
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="text-sm"> Sort by: </span>
                    <Select value={sortValue} onValueChange={value => setSortValue(value)}>
                        <SelectTrigger className="w-[100px] cursor-pointer rounded-lg select-none">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                            align="start"
                            className="p-1"
                        >
                            <SelectItem value="name" className="cursor-pointer"> Name </SelectItem>
                            <SelectItem value="size" className="cursor-pointer"> Size </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>
            <ContextMenu>
                <ContextMenuTrigger>
                    <section ref={ref} className="overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
                        <RichTreeView
                            defaultExpandedItems={["3"]}
                            items={ITEMS}
                            slots={{ item: TreeItem }}
                            selectedItems={selectedItems}
                            onSelectedItemsChange={handleSelectedItemsChange}
                            multiSelect
                        />
                    </section>
                </ContextMenuTrigger>
                {selectedItems.length > 0 ?
                    <ContextMenuContentDropdown 
                        itemGroups={DROPDOWN_ITEM_GROUPS}
                    />
                :
                    <ContextMenuContentDropdown />
                }
            </ContextMenu>
        </main>
    );
}