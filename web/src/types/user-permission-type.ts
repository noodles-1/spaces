import { Item } from "@/types/item-type";

export type UserPermission = {
    id: string;
    userId: string;
    type: "EDIT" | "VIEW";
    item: Item;
    createdAt: string;
    updatedAt: string;
};