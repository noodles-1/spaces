import { FileWithPath } from "react-dropzone";

import axios from "axios";
import axiosClient from "@/lib/axios-client";

import { fetcher } from "@/services/fetcher";
import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export async function createMainDirectories(): Promise<ResponseDto> {
    const response = await axiosClient.post("/storage/items/create-main-dirs");
    return response.data;
}

interface UploadFileParams {
    file: FileWithPath;
    setProgress: (progress: number) => void;
}

export async function uploadFile(params: UploadFileParams): Promise<{ isUploaded: boolean, fileId: string }> {
    const { file, setProgress } = params;

    const endpoint = `/storage/generate-upload-url?contentType=${file.type}`;

    const response = await fetcher<{ uploadUrl: string, fileId: string }>(endpoint);
    const uploadUrl = response.data.uploadUrl;
    const fileId = response.data.fileId;
    
    const uploadResponse = await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const progress = (progressEvent.loaded / progressEvent.total) * 100;
                setProgress(progress);
            }
        }
    })

    if (uploadResponse.status !== 200) {
        throw new Error(`Failed to upload ${file.name} due to ${uploadResponse.statusText}.`);
    }

    return {
        isUploaded: true,
        fileId
    };
}

interface DownloadFileParams {
    file: Item;
    setProgress?: (progress: number) => void;
    setDownloadedBits?: (downloadedBytes: number) => void;
}

export async function downloadFile(params: DownloadFileParams): Promise<{ isDownloaded: boolean, blob: Blob }> {
    const { file, setProgress, setDownloadedBits } = params;

    const response = await axiosClient.post<ResponseDto<{ downloadUrl: string }>>("/storage/generate-download-url", {
        fileId: file.id,
        filename: file.name
    }, {
        headers: { "Content-Type": "application/json" },
    });
    const downloadUrl = response.data.data.downloadUrl;
    
    const downloadResponse = await axios.get(downloadUrl, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const progress = (progressEvent.loaded / progressEvent.total) * 100;
                if (setProgress && setDownloadedBits) {
                    setProgress(progress);
                    setDownloadedBits(progressEvent.loaded);
                }
            }
        }
    });
    
    if (downloadResponse.status !== 200) {
        throw new Error(`Failed to download ${file.name} due to ${downloadResponse.statusText}.`);
    }

    return {
        isDownloaded: true,
        blob: downloadResponse.data
    };
}

interface CreateItemParams {
    id?: string;
    name: string;
    type: "FOLDER" | "FILE";
    parentId?: string;
    contentType?: string;
    size?: number;
}

export async function createItem(params: CreateItemParams): Promise<ResponseDto<Item>> {
    const response = await axiosClient.post("/storage/items/create", params, {
        headers: { "Content-Type": "application/json" }
    });

    return response.data;
}

interface ToggleItemStarredParams {
    itemId: string;
}

export async function toggleItemStarred(params: ToggleItemStarredParams): Promise<ResponseDto> {
    const { itemId } = params;

    const response = await axiosClient.patch(`/storage/items/star/${itemId}`);
    return response.data;
}

interface MoveItemParams {
    itemId: string;
    sourceParentId?: string;
}

export async function deleteItem(params: MoveItemParams): Promise<ResponseDto> {
    const response = await axiosClient.patch("/storage/items/delete", params, {
        headers: { "Content-Type": "application/json" }
    });

    return response.data;
}

export async function restoreItem(params: MoveItemParams): Promise<ResponseDto> {
    const response = await axiosClient.patch("/storage/items/restore", params, {
        headers: { "Content-Type": "application/json" }
    });

    return response.data;
}