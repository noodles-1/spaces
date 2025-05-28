export type Item = {
    id: string;
    name: string;
    ownerUserId?: string;
    type: "FOLDER" | "FILE";
    contentType?: string;
    size?: number;
    isRoot: boolean;
    accessibleParentId?: string;
    createdAt: string;
    updatedAt: string;
};
