export type Item = {
    id: string;
    name: string;
    createdBy?: string;
    type: "FOLDER" | "FILE";
    contentType?: string;
    size?: number;
    root: boolean;
    children?: Item[];
    accessibleParentId?: string;
    createdAt: string;
    updatedAt: string;
};
