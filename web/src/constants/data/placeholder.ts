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
import { File } from "@/types/file-type";

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

export const FILES: File[] = [
    {
        id: "1",
        name: "item 1",
        category: "image/png",
        type: "mp3",
        owner: "Chowlong",
        lastModified: new Date(),
        size: "3.2 MB",
    },
    {
        id: "2",
        name: "item 2",
        type: "-",
        owner: "Chowlong",
        lastModified: getDateFromToday(2),
        size: "-",
    },
    {
        id: "3",
        name: "item 3",
        category: "image",
        type: "png",
        owner: "Chowlong",
        lastModified: getDateFromToday(15),
        size: "725 KB",
    },
    {
        id: "4",
        name: "item 4",
        category: "document",
        type: "docx",
        owner: "Chowlong",
        lastModified: getDateFromToday(7),
        size: "75 KB",
    },
    {
        id: "5",
        name: "item 5",
        type: "-",
        owner: "Chowlong",
        lastModified: getDateFromToday(2),
        size: "-",
    },
    {
        id: "6",
        name: "item 6",
        category: "compressed",
        type: "zip",
        owner: "Chowlong",
        lastModified: getDateFromToday(10),
        size: "2.8 MB",
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