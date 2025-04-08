import { FileType } from "@/types/file-types";

export type ListItemType = {
    name: string;
    type: FileType;
    owner: string;
    lastModified: Date;
    size: string;
};
