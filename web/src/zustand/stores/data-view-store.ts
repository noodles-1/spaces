import { createStore } from "zustand/vanilla";

export type DataViewState = {
    view: "grid" | "list";
};

export type DataViewActions = {
    setGridView: () => void;
    setListView: () => void;
};

export type DataViewStore = DataViewState & DataViewActions;

export const defaultInitState: DataViewState = {
    view: "grid",
};

export const createDataViewStore = (
    initState: DataViewState = defaultInitState,
) => {
    return createStore<DataViewStore>()((set) => ({
        ...initState,
        setGridView: () => set(() => ({ view: "grid" })),
        setListView: () => set(() => ({ view: "list" })),
    }));
};
