import { useEffect, useState } from "react";

import { FileIcon } from "@/components/custom/data/file-icon";
import { Progress } from "@/components/ui/progress";

import { Upload } from "@/types/upload-type";
import { uploadFile } from "@/actions/storage";
import { useUploadStore } from "@/zustand/providers/upload-store-provider";
import { formatFileSize } from "@/lib/custom/file-size";

export function UploadFile({
    upload,
    idx,
}: {
    upload: Upload
    idx: number
}) {
    const { setUploading, setUploaded } = useUploadStore(state => state);

    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        const handleUpload = async () => {
            if (upload.isUploaded) {
                return;
            }

            setUploading(idx);

            const isUploaded = await uploadFile({
                file: upload.file,
                setProgress
            });
            
            if (isUploaded) {
                setUploaded(idx);
            }
        };

        handleUpload();
    }, [upload.file, upload.isUploaded, idx]);

    return (
        <div className="flex flex-col gap-5 p-4 border-2 rounded-lg border-zinc-800">
            <section className="flex items-center gap-4">
                <FileIcon contentType={upload.file.type} className="w-4 h-4" />
                <div className="text-[12px]">
                    <span className="flex-1">
                        {upload.file.name}
                    </span>
                    <span className="text-zinc-400">
                        {" " + `(${formatFileSize(upload.file.size)})`}
                    </span>
                </div>
            </section>
            {progress < 100 && <Progress value={progress} className="h-1" />}
        </div>
    );
}