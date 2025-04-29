import { FileCategory } from "@/types/file-category-type";

export type File = {
    id: string;
    name: string;
    category: FileCategory;
    type: string;
    owner: string;
    lastModified: Date;
    size: string;
};
