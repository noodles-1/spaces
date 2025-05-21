import { FileWithPath } from "react-dropzone";
import { createStore } from "zustand";

import { Upload } from "@/types/upload-type";

export type UploadState = {
    uploads: Upload[];
};

export type UploadActions = {
    addFile: (file: FileWithPath) => void;
    clearFiles: () => void;
    setUploading: (idx: number) => void;
    setUploaded: (idx: number) => void;
};

export type UploadStore = UploadState & UploadActions;

export const defaultInitState: UploadState = {
    uploads: []
};

export const createUploadStore = (
    initState: UploadState = defaultInitState,
) => {
    return createStore<UploadStore>()(set => ({
        ...initState,
        addFile: (file) => set(state => ({
            uploads: [
                ...state.uploads,
                {
                    file,
                    isUploading: false,
                    isUploaded: false
                }
            ]
        })),
        clearFiles: () => set(() => ({
            uploads: []
        })),
        setUploading: (idx) => set(state => ({
            uploads: state.uploads.map((file, i) => 
                i === idx
                    ? { ...file, isUploading: true, isUploaded: false }
                    : file
            )
        })),
        setUploaded: (idx) => set(state => ({
            uploads: state.uploads.map((file, i) => 
                i === idx
                    ? { ...file, isUploading: false, isUploaded: true }
                    : file
            )
        })),
    }));
};