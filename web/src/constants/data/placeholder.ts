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

import { DropdownItem } from "@/types/dropdown-items-type";

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