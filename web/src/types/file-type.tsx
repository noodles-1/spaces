import { FileType } from "@/types/file-types";

export type File = {
    id: string;
    name: string;
    type: FileType;
    owner: string;
    lastModified: Date;
    size: string;
};
