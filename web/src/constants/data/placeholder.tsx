import { DropdownItem } from "@/types/dropdown-items-type";
import { FileType } from "@/types/file-types";
import {
    ArrowLeftRight,
    Copy,
    Download,
    FolderInput,
    PenLine,
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
            label: "Move",
            icon: FolderInput,
            onClick: () => {},
        },
    ],
];
