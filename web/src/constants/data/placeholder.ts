import {
    ArrowLeftRight,
    Copy,
    Download,
    FolderInput,
    Info,
    PenLine,
    Star,
    Trash,
} from "lucide-react";

import { Ancestor } from "@/types/ancestor-type";
import { DropdownItem } from "@/types/dropdown-items-type";
import { Item } from "@/types/item-type";

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
            label: "Add to starred",
            icon: Star,
            onClick: () => {},
        },
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

export const FILES: Item[] = [
    {
        id: "1",
        name: "item 1",
        contentType: "image/png",
        type: "mp3",
        updatedAt: new Date(),
        size: 100,
    },
    {
        id: "2",
        name: "item 2",
        type: "-",
        updatedAt: getDateFromToday(2),
    },
    {
        id: "3",
        name: "item 3",
        contentType: "image",
        type: "png",
        updatedAt: getDateFromToday(15),
        size: 100,
    },
    {
        id: "4",
        name: "item 4",
        contentType: "document",
        type: "docx",
        updatedAt: getDateFromToday(7),
        size: 100,
    },
    {
        id: "5",
        name: "item 5",
        type: "-",
        updatedAt: getDateFromToday(2),
    },
    {
        id: "6",
        name: "item 6",
        contentType: "compressed",
        type: "zip",
        updatedAt: getDateFromToday(10),
        size: 100,
    },
];

export const ANCESTORS: Ancestor[] = [
    {
        folderId: "home",
        folderName: "home",
    },
    {
        folderId: "folderA",
        folderName: "Folder A",
    },
    {
        folderId: "folderB",
        folderName: "Folder B",
    },
    {
        folderId: "folderC",
        folderName: "Folder C",
    },
];