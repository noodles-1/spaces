"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    type StorageTreeStore,
    createStorageTreeStore,
} from "@/zustand/stores/storage-tree-store";

export type StorageTreeStoreApi = ReturnType<typeof createStorageTreeStore>;

export const StorageTreeStoreContext = createContext<StorageTreeStoreApi | undefined>(
    undefined,
);

export const StorageTreeStoreProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const storeRef = useRef<StorageTreeStoreApi | null>(null);

    if (storeRef.current === null) storeRef.current = createStorageTreeStore();

    return (
        <StorageTreeStoreContext.Provider value={storeRef.current}>
            {children}
        </StorageTreeStoreContext.Provider>
    );
};

export const useStorageTreeStore = <T,>(
    selector: (store: StorageTreeStore) => T,
): T => {
    const uploadStoreContext = useContext(StorageTreeStoreContext);

    if (!uploadStoreContext)
        throw new Error(
            "useStorageTreeStore must be within StorageTreeStoreProvider",
        );

    return useStore(uploadStoreContext, selector);
};
