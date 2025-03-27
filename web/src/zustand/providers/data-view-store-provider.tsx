'use client'

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type DataViewStore, createDataViewStore } from "@/zustand/stores/data-view-store";

export type DataViewStoreApi = ReturnType<typeof createDataViewStore>

export const DataViewStoreContext = createContext<DataViewStoreApi | undefined>(
    undefined,
)

export const DataViewStoreProvider = ({
    children,
}: {
    children: ReactNode
}) => {
    const storeRef = useRef<DataViewStoreApi | null>(null);
    
    if (storeRef.current === null)
        storeRef.current = createDataViewStore();

    return (
        <DataViewStoreContext.Provider value={storeRef.current}>
            {children}
        </DataViewStoreContext.Provider>
    );
}

export const useDataViewStore = <T,>(
    selector: (store: DataViewStore) => T,
): T => {
    const dataViewStoreContext = useContext(DataViewStoreContext);

    if (!dataViewStoreContext)
        throw new Error("useDataViewStore must be within DataViewStoreProvider");

    return useStore(dataViewStoreContext, selector);
}