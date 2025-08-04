import { Item } from "@/types/item-type";

export type UserStarred = {
    id: string;
    userId: string;
    item: Item
};