import { FileType } from "@/types/file-types";

import {
    Clapperboard,
    FileSpreadsheet,
    FileText,
    Headphones,
    Image as ImageIcon,
} from "lucide-react";

export function FileIcon({
    fileType,
    className,
}: {
    fileType: FileType;
    className?: string;
}) {
    switch (fileType) {
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
    }
}
