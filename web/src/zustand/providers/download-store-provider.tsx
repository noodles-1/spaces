"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
    type DownloadStore,
    createDownloadStore,
} from "@/zustand/stores/download-store";

export type DownloadStoreApi = ReturnType<typeof createDownloadStore>;

export const DownloadStoreContext = createContext<DownloadStoreApi | undefined>(
    undefined,
);

export const DownloadStoreProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const storeRef = useRef<DownloadStoreApi | null>(null);

    if (storeRef.current === null) storeRef.current = createDownloadStore();

    return (
        <DownloadStoreContext.Provider value={storeRef.current}>
            {children}
        </DownloadStoreContext.Provider>
    );
};

export const useDownloadStore = <T,>(
    selector: (store: DownloadStore) => T,
): T => {
    const downloadStoreContext = useContext(DownloadStoreContext);

    if (!downloadStoreContext)
        throw new Error(
            "useDownloadStore must be within DownloadStoreProvider",
        );

    return useStore(downloadStoreContext, selector);
};
