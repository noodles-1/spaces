import { createStore } from "zustand";

import { Download } from "@/types/download-type";
import { Item } from "@/types/item-type";

export type DownloadState = {
    downloads: Download[];
};

export type DownloadActions = {
    addFile: (file: Item) => void;
    clearFiles: () => void;
    setDownloading: (idx: number) => void;
    setDownloaded: (idx: number) => void;
};

export type DownloadStore = DownloadState & DownloadActions;

export const defaultInitState: DownloadState = {
    downloads: []
};

export const createDownloadStore = (
    initState: DownloadState = defaultInitState,
) => {
    return createStore<DownloadStore>()(set => ({
        ...initState,
        addFile: (file) => set(state => ({
            downloads: [
                ...state.downloads,
                {
                    file,
                    isDownloading: false,
                    isDownloaded: false
                }
            ]
        })),
        clearFiles: () => set(() => ({
            downloads: []
        })),
        setDownloading: (idx) => set(state => ({
            downloads: state.downloads.map((file, i) => 
                i === idx
                    ? { ...file, isDownloading: true, isDownloaded: false }
                    : file
            )
        })),
        setDownloaded: (idx) => set(state => ({
            downloads: state.downloads.map((file, i) => 
                i === idx
                    ? { ...file, isDownloading: false, isDownloaded: true }
                    : file
            )
        })),
    }));
};