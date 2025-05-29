import { FileWithPath, useDropzone } from "react-dropzone";

import { uploadToast } from "@/lib/custom/upload-toast";
import { useUploadStore } from "@/zustand/providers/upload-store-provider";

export function Dropzone() {
    const { uploads, addFile } = useUploadStore(state => state);

    const { isDragActive, getRootProps, getInputProps } = useDropzone({
        noClick: true,
        noKeyboard: true,
        noDragEventsBubbling: true,
        onDrop: files => handleDrop(files)
    });

    const handleDrop = (files: readonly FileWithPath[]) => {
        if (uploads.length === 0)
            uploadToast();
        
        files.map(file => addFile(file));
    };

    return (
        <main className={`
            w-full h-full
            absolute transition-all opacity-0 
            border-4 border-dashed border-spaces-primary bg-zinc-700 rounded-2xl
            ${isDragActive && "z-50 opacity-50"}
        `}>
            <div {...getRootProps()} className="w-screen h-screen">
                <input {...getInputProps()} />
            </div>
            <span className="absolute text-sm -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                Drop your files here to upload.
            </span>
        </main>
    );
}