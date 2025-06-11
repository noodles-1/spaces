import { Item } from "@/types/item-type";

export interface Download {
    file: Item;
    isDownloading: boolean;
    isDownloaded: boolean;
}