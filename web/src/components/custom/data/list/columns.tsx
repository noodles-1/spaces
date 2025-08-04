import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { Item } from "@/types/item-type";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OwnerColumn } from "@/components/custom/data/list/owner-column";
import { StarColumn } from "@/components/custom/data/list/star-column";

import { formatFileSize } from "@/lib/custom/file-size";

export const columns: ColumnDef<Item>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <span> Name </span>
                    <Button
                        variant="secondary"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="rounded-full hover:cursor-pointer hover:bg-zinc-700"
                    >
                        <ArrowUpDown className="w-4 h-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const item = row.original as Item;

            return (
                <StarColumn item={item} />
            );
        },
    },
    {
        accessorKey: "owner",
        header: "Owner",
        cell: ({ row }) => {
            return (
                <OwnerColumn item={row.original} />
            );
        },
    },
    {
        accessorKey: "lastModified",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <span> Last modified </span>
                    <Button
                        variant="secondary"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                        className="rounded-full hover:cursor-pointer hover:bg-zinc-700"
                    >
                        <ArrowUpDown className="w-4 h-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const itemLastModifiedDate = new Date(row.original.updatedAt);
            const formattedDate = itemLastModifiedDate.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                },
            );

            return <span className="text-zinc-300"> {formattedDate} </span>;
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <span className="text-zinc-300">
                {row.original.type === "FILE" ? 
                    row.original.name.split(".").slice(-1)[0]
                :
                    "-"
                }
            </span>
        ),
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => (
            <>
                {row.original.size ?
                    <span className="text-zinc-300"> {formatFileSize(row.original.size)} </span>
                :
                    <span className="text-zinc-300"> - </span>
                }
            </>
        ),
    },
];
