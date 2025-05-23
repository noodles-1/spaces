import { getFileCategoryFromContentType } from "@/lib/custom/content-type";
import {
    Clapperboard,
    File,
    FileSpreadsheet,
    FileText,
    Folder,
    FolderArchive,
    Headphones,
    Image as ImageIcon,
} from "lucide-react";

export function FileIcon({
    contentType,
    className,
}: {
    contentType?: string;
    className?: string;
}) {
    const fileCategory = getFileCategoryFromContentType(contentType);

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
        case "default":
        default:
            return <File className={className} />;
    }
}
