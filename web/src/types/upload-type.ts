import { FileWithPath } from "react-dropzone";

export interface Upload {
    file: FileWithPath;
    isUploading: boolean;
    isUploaded: boolean;
}