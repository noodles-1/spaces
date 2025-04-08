import { ColumnDef } from "@tanstack/react-table";
import { ListItemType } from "@/types/list-item-type";

import { ArrowUpDown, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EllipsisDropdown } from "@/components/custom/data/ellipsis-dropdown";
import { FileIcon } from "@/components/custom/data/file-icon";

import { DROPDOWN_ITEM_GROUPS } from "@/constants/data/placeholder";

export const columns: ColumnDef<ListItemType>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <span> Name </span>
                    <Button
                        variant="secondary"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hover:cursor-pointer hover:bg-zinc-700 rounded-full"
                    >
                        <ArrowUpDown className="h-4 w-4"/>
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const item = row.original;

            return (
                <div className="flex gap-8 items-center">
                    <FileIcon fileType={item.type} className="h-4 w-4"/>
                    <span> {item.name} </span>
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
                    <div className="rounded-full outline p-1.5">
                        <UserRound className="h-5 w-5" />
                    </div>
                    <span> {row.original.owner} </span>
                </div>
            );
        }
    },
    {
        accessorKey: "lastModified",
        header: ({ column }) => {
            return (
                <div className="flex items-center gap-2">
                    <span> Last modified </span>
                    <Button
                        variant="secondary"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hover:cursor-pointer hover:bg-zinc-700 rounded-full"
                    >
                        <ArrowUpDown className="h-4 w-4"/>
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const itemLastModifiedDate = row.original.lastModified;
            const formattedDate = itemLastModifiedDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });

            return <span className="text-zinc-300"> {formattedDate} </span>;
        }
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => <span className="text-zinc-300"> {row.original.size} </span>
    },
    {
        id: "actions",
        cell: () => <EllipsisDropdown itemGroups={DROPDOWN_ITEM_GROUPS}/>
    }
];
