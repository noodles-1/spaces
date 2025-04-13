import { FileCategory } from "@/types/file-category-type";

import {
    Clapperboard,
    FileSpreadsheet,
    FileText,
    Folder,
    FolderArchive,
    Headphones,
    Image as ImageIcon,
} from "lucide-react";

export function FileIcon({
    fileCategory,
    className,
}: {
    fileCategory: FileCategory;
    className?: string;
}) {
    switch (fileCategory) {
        case "image":
            return <ImageIcon className={className} />;
        case "document":
            return <FileSpreadsheet className={className} />;
        case "text":
            return <FileText className={className} />;
        case "audio":
            return <Headphones className={className} />;
        case "video":
            return <Clapperboard className={className} />;
        case "folder":
            return <Folder className={className} fill="white" />;
        case "compressed":
            return <FolderArchive className={className} />;
    }
}
