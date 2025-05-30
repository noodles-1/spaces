import { FileWithPath } from "react-dropzone";

import axios from "axios";
import axiosClient from "@/lib/axios-client";

import { fetcher } from "@/actions/fetcher";
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

export async function uploadFile(params: UploadFileParams): Promise<boolean> {
    const { file, setProgress } = params;

    const endpoint = `/storage/generate-upload-url?fileName=${file.name}&contentType=${file.type}`;

    const response = await fetcher(endpoint);
    const uploadUrl = response.data.uploadUrl;

    if (!uploadUrl) {
        return false;
    }
    
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

    return true;
}

interface CreateItemParams {
    name: string;
    type: "FOLDER" | "FILE";
    parentId?: string;
    contentType?: string;
    size?: number;
}

export async function createItem(params: CreateItemParams): Promise<ResponseDto<Item>> {
    const response = await axiosClient.post(`/storage/items/create`, params, {
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