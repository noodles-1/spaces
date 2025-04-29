import React from "react";

import { ColumnDef } from "@tanstack/react-table";
import { File } from "@/types/file-type";

import { ArrowUpDown, Star, UserRound } from "lucide-react";

import { customToast } from "@/lib/custom/utils";

import { Button } from "@/components/ui/button";
import { FileIcon } from "@/components/custom/data/file-icon";

export const columns: ColumnDef<File>[] = [
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
            const item = row.original;

            const handleStarred = (event: React.MouseEvent<SVGSVGElement>) => {
                event.stopPropagation();
                customToast({
                    icon: <Star className="w-4 h-4" color="white" />,
                    message: `${item.name} has been added to starred`,
                });
            };

            return (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <FileIcon
                            fileCategory={item.category}
                            className="w-4 h-4"
                        />
                        <span> {item.name} </span>
                    </div>
                    <Star
                        onClick={handleStarred}
                        className="w-4 h-4 mx-4 opacity-0 cursor-pointer group-hover:opacity-100 hover:fill-white"
                    />
                </div>
            );
        },
    },
    {
        accessorKey: "owner",
        header: "Owner",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-4">
                    <div className="rounded-full p-1.5 outline">
                        <UserRound className="w-5 h-5" />
                    </div>
                    <span> {row.original.owner} </span>
                </div>
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
            const itemLastModifiedDate = row.original.lastModified;
            const formattedDate = itemLastModifiedDate.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                },
            );

            return <span className="text-zinc-300"> {formattedDate} </span>;
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <span className="text-zinc-300"> {row.original.type} </span>
        ),
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => (
            <span className="text-zinc-300"> {row.original.size} </span>
        ),
    },
];
