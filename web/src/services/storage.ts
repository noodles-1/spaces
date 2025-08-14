import { Dispatch, SetStateAction } from "react";
import { FileWithPath } from "react-dropzone";
import axios from "axios";

import axiosClient from "@/lib/axios-client";

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

    const response = await axiosClient.get<ResponseDto<{ uploadUrl: string, fileId: string }>>(endpoint);
    const uploadUrl = response.data.data.uploadUrl;
    const fileId = response.data.data.fileId;
    
    const uploadResponse = await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const progress = (progressEvent.loaded / progressEvent.total) * 100;
                setProgress(progress);
            }
        }
    });

    if (uploadResponse.status !== 200) {
        throw new Error(`Failed to upload ${file.name} due to ${uploadResponse.statusText}.`);
    }

    return {
        isUploaded: true,
        fileId
    };
}

interface UploadThumbnailParams {
    fileId: string;
    thumbnail: FileWithPath;
}

export async function uploadThumbnail(params: UploadThumbnailParams): Promise<void> {
    const { fileId, thumbnail } = params;

    const response = await axiosClient.post<ResponseDto<{ uploadUrl: string }>>("/storage/generate-thumbnail-upload-url", {
        fileId,
        contentType: thumbnail.type
    }, {
        headers: { "Content-Type": "application/json" },
    });
    const uploadUrl = response.data.data.uploadUrl;

    const uploadResponse = await axios.put(uploadUrl, thumbnail, {
        headers: { "Content-Type": thumbnail.type },
    });

    console.log(response)

    if (uploadResponse.status !== 200) {
        throw new Error(`Failed to upload ${thumbnail.name} due to ${uploadResponse.statusText}.`);
    }
}

interface DownloadFileParams {
    file: Item;
    totalFolderSize?: number;
    setProgress: Dispatch<SetStateAction<number>>;
    setDownloadedBits: Dispatch<SetStateAction<number>>;
}

export async function downloadFile(params: DownloadFileParams): Promise<{ isDownloaded: boolean, blob: Blob }> {
    const { file, totalFolderSize, setProgress, setDownloadedBits } = params;

    const response = await axiosClient.post<ResponseDto<{ downloadUrl: string }>>("/storage/public/generate-download-url", {
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
                if (totalFolderSize !== undefined) {
                    setDownloadedBits(prev => {
                        const downloadedBits = prev + progressEvent.bytes;
                        const progress = downloadedBits / totalFolderSize * 100;
                        setProgress(progress);
                        return downloadedBits;
                    });
                }
                else {
                    const progress = progressEvent.loaded / progressEvent.total * 100;
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
        blob: downloadResponse.data,
    };
}

interface DuplicateItemParams {
    sourceKey: string;
    destinationKey: string;
}

export async function duplicateItem(params: DuplicateItemParams): Promise<boolean> {
    const { sourceKey, destinationKey } = params;

    const response = await axiosClient.post("/storage/duplicate", {
        sourceKey,
        destinationKey
    }, {
        headers: { "Content-Type": "application/json" }
    });

    if (response.status !== 200) {
        throw new Error(`Failed to duplicate ${sourceKey} due to ${response.statusText}.`);
    }

    return true;
}

export async function duplicateThumbnail(params: DuplicateItemParams): Promise<boolean> {
    const { sourceKey, destinationKey } = params;

    const response = await axiosClient.post("/storage/duplicate-thumbnail", {
        sourceKey,
        destinationKey
    }, {
        headers: { "Content-Type": "application/json" }
    });

    if (response.status !== 200) {
        throw new Error(`Failed to duplicate ${sourceKey} due to ${response.statusText}.`);
    }

    return true;
}

interface DeleteItemParams {
    file: Item;
}

export async function deleteFile(params: DeleteItemParams): Promise<boolean> {
    const response = await axiosClient.delete<ResponseDto<{ deleteUrl: string }>>(`/storage/generate-delete-url/${params.file.id}`, {
        headers: { "Content-Type": "application/json" }
    });

    const deleteUrl = response.data.data.deleteUrl;
    const deleteResponse = await axios.delete(deleteUrl);

    if (deleteResponse.status !== 204) {
        throw new Error(`Failed to delete ${params.file.name}.`);
    }

    return true;
}

export async function deleteThumbnail(params: DeleteItemParams): Promise<boolean> {
    const response = await axiosClient.delete<ResponseDto<{ deleteUrl: string }>>(`/storage/generate-thumbnail-delete-url/${params.file.id}`, {
        headers: { "Content-Type": "application/json" }
    });

    const deleteUrl = response.data.data.deleteUrl;
    const deleteResponse = await axios.delete(deleteUrl);

    if (deleteResponse.status !== 204) {
        throw new Error(`Failed to delete ${params.file.name}.`);
    }

    return true;
}

interface CreateItemParams {
    id?: string;
    name: string;
    ownerUserId?: string;
    type: "FOLDER" | "FILE";
    parentId?: string;
    contentType?: string;
    size?: number;
}

export async function createItem(params: CreateItemParams): Promise<ResponseDto<{ item: Item }>> {
    const response = await axiosClient.post("/storage/items/create", params, {
        headers: { "Content-Type": "application/json" }
    });

    return response.data;
}

interface MoveItemParams {
    itemId: string;
    sourceParentId?: string;
    destinationParentId?: string;
    ownerUserId?: string;
}

export async function moveItem(params: MoveItemParams): Promise<ResponseDto> {
    const response = await axiosClient.patch("/storage/items/move", params, {
        headers: { "Content-Type": "application/json" }
    });

    return response.data;
}

export async function deleteItem(params: MoveItemParams): Promise<ResponseDto> {
    const response = await axiosClient.patch("/storage/items/delete", params, {
        headers: { "Content-Type": "application/json" }
    });

    return response.data;
}

export async function deleteSharedItem(params: MoveItemParams): Promise<ResponseDto> {
    const response = await axiosClient.patch("/storage/items/delete/shared", params, {
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

interface RenameItemParams {
    itemId: string;
    itemFileExtension?: string;
    newItemName: string;
}

export async function renameItem(params: RenameItemParams): Promise<ResponseDto> {
    const response = await axiosClient.patch("/storage/items/rename", params, {
        headers: { "Content-Type": "application/json" }
    });

    return response.data;
}

interface DeleteItemPermanently {
    itemId: string;
}

export async function deleteItemPermanently(params: DeleteItemPermanently): Promise<ResponseDto> {
    const response = await axiosClient.delete(`/storage/items/delete/permanent/${params.itemId}`, {
        headers: { "Content-Type": "application/json" }
    });

    return response.data;
}