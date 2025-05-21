import { FileCategory } from "@/types/file-category-type";

export function getFileCategoryFromContentType(contentType: string | undefined): FileCategory {
    if (!contentType) return "folder";

    if (contentType.startsWith("image/")) return "image";
    if (contentType.startsWith("video/")) return "video";
    if (contentType.startsWith("audio/")) return "audio";
    if (
        contentType === "application/pdf" ||
        contentType === "application/msword" ||
        contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        contentType === "application/vnd.ms-excel" ||
        contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        contentType === "application/vnd.ms-powerpoint" ||
        contentType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
        return "document";
    }
    if (contentType.startsWith("text/")) return "text";
    if (
        contentType === "application/zip" ||
        contentType === "application/x-rar-compressed" ||
        contentType === "application/x-7z-compressed" ||
        contentType === "application/gzip"
    ) {
        return "compressed";
    }

    return "default";
}