import { DropdownItem } from "@/types/dropdown-items-type";
import { FileType } from "@/types/file-types";
import { ListItemType } from "@/types/list-item-type";
import {
    ArrowLeftRight,
    Copy,
    Download,
    FolderInput,
    Info,
    PenLine,
    Trash,
} from "lucide-react";

export const FOLDERS = [
    {
        name: "folder 1",
    },
    {
        name: "folder 2",
    },
    {
        name: "folder 3",
    },
    {
        name: "folder 4",
    },
    {
        name: "folder 5",
    },
];

export const FILES: { name: string; type: FileType }[] = [
    {
        name: "file 1",
        type: "image",
    },
    {
        name: "file 2",
        type: "document",
    },
    {
        name: "file 3",
        type: "text",
    },
    {
        name: "file 1",
        type: "document",
    },
    {
        name: "file 4",
        type: "audio",
    },
    {
        name: "file 5",
        type: "video",
    },
    {
        name: "file 5",
        type: "compressed",
    },
];

export const DROPDOWN_ITEM_GROUPS: DropdownItem[][] = [
    [
        {
            label: "Download",
            icon: Download,
            onClick: () => {},
        },
        {
            label: "Rename",
            icon: PenLine,
            onClick: () => {},
        },
        {
            label: "Duplicate",
            icon: Copy,
            onClick: () => {},
        },
    ],
    [
        {
            label: "Convert",
            icon: ArrowLeftRight,
            onClick: () => {},
        },
        {
            label: "Move",
            icon: FolderInput,
            onClick: () => {},
        },
        {
            label: "Folder information",
            icon: Info,
            onClick: () => {},
        },
    ],
    [
        {
            label: "Move to trash",
            icon: Trash,
            onClick: () => {},
        },
    ],
];

function getDateFromToday(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

export const LIST_ITEMS: ListItemType[] = [
    {
        name: "item 1",
        type: "audio",
        owner: "Chowlong",
        lastModified: new Date(),
        size: "3.2 MB"
    },
    {
        name: "item 2",
        type: "folder",
        owner: "Chowlong",
        lastModified: getDateFromToday(2),
        size: "-"
    },
    {
        name: "item 3",
        type: "image",
        owner: "Chowlong",
        lastModified: getDateFromToday(15),
        size: "725 KB"
    },
    {
        name: "item 4",
        type: "document",
        owner: "Chowlong",
        lastModified: getDateFromToday(7),
        size: "75 KB"
    },
    {
        name: "item 5",
        type: "folder",
        owner: "Chowlong",
        lastModified: getDateFromToday(2),
        size: "-"
    },
];