import { createStore } from "zustand";
import { Item } from "@/types/item-type";

export type StorageTreeState = {
    itemMap: Map<string, Item>;
};

export type StorageTreeActions = {
    addItem: (key: string, value: Item) => void;
};

export type StorageTreeStore = StorageTreeState & StorageTreeActions;

export const defaultInitState: StorageTreeState = {
    itemMap: new Map(),
};

export const createStorageTreeStore = (
    initState: StorageTreeState = defaultInitState,
) => {
    return createStore<StorageTreeStore>()(set => ({
        ...initState,
        addItem: (key, value) => set(state => {
            const newMap = new Map(state.itemMap);
            newMap.set(key, value);
            return {
                itemMap: newMap
            };
        })
    }));
};