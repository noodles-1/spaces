import axios from "axios";
import { FileWithPath } from "react-dropzone";

import { fetcher } from "@/actions/fetcher";

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