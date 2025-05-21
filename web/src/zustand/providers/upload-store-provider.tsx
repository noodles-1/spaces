"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    type UploadStore,
    createUploadStore,
} from "@/zustand/stores/upload-store";

export type UploadStoreApi = ReturnType<typeof createUploadStore>;

export const UploadStoreContext = createContext<UploadStoreApi | undefined>(
    undefined,
);

export const UploadStoreProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const storeRef = useRef<UploadStoreApi | null>(null);

    if (storeRef.current === null) storeRef.current = createUploadStore();

    return (
        <UploadStoreContext.Provider value={storeRef.current}>
            {children}
        </UploadStoreContext.Provider>
    );
};

export const useUploadStore = <T,>(
    selector: (store: UploadStore) => T,
): T => {
    const uploadStoreContext = useContext(UploadStoreContext);

    if (!uploadStoreContext)
        throw new Error(
            "useUploadStore must be within UploadStoreProvider",
        );

    return useStore(uploadStoreContext, selector);
};
