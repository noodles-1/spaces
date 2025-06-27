import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { CircleX } from "lucide-react";

import { FileIcon } from "@/components/custom/data/file-icon";
import { Progress } from "@/components/ui/progress";

import { createItem, uploadFile } from "@/services/storage";
import { useUploadStore } from "@/zustand/providers/upload-store-provider";
import { formatFileSize } from "@/lib/custom/file-size";
import { customToast } from "@/lib/custom/custom-toast";

import { Upload } from "@/types/upload-type";
import { ResponseDto } from "@/dto/response-dto";

export function UploadFile({
    upload,
    idx,
}: {
    upload: Upload
    idx: number
}) {
    const pathname = usePathname();

    const { setUploading, setUploaded } = useUploadStore(state => state);

    const hasRun = useRef<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const createItemMutation = useMutation({
        mutationFn: createItem
    });
    const queryClient = useQueryClient();

    useEffect(() => {
        if (hasRun.current)
            return;

        hasRun.current = true;

        const handleUpload = async () => {
            try {
                if (upload.isUploaded) {
                    return;
                }
    
                setUploading(idx);
    
                const uploadResponse = await uploadFile({
                    file: upload.file,
                    setProgress
                });
                
                if (uploadResponse.isUploaded) {
                    setUploaded(idx);
    
                    const paths = pathname.split("/");
                    const parentId = paths.length === 4 ? paths[3] : undefined;
                    await createItemMutation.mutateAsync({
                        id: uploadResponse.fileId,
                        name: upload.file.name,
                        type: "FILE",
                        parentId,
                        contentType: upload.file.type,
                        size: upload.file.size
                    });
    
                    queryClient.invalidateQueries({
                        queryKey: ["user-accessible-items"]
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["user-accessible-items-recursive"]
                    });
                    
                    if (parentId) {
                        queryClient.invalidateQueries({
                            queryKey: ["user-accessible-items", parentId]
                        });
                    }
                }
            }
            catch (error) {
                const axiosError = error as AxiosError;
                const data = axiosError.response?.data as ResponseDto;

                customToast({
                    icon: <CircleX className="w-4 h-4" color="white" />,
                    message: data.message
                });
            }
        };

        handleUpload();
    }, []);

    return (
        <div className="flex flex-col gap-5 p-4 border-2 rounded-lg border-zinc-800">
            <section className="flex items-center gap-4">
                <FileIcon contentType={upload.file.type} className="w-4 h-4" />
                <div className="text-[12px]">
                    <div className="max-w-[16rem] overflow-x-hidden text-ellipsis whitespace-nowrap">
                        {upload.file.name}
                    </div>
                    <span className="text-zinc-400">
                        {" " + `(${formatFileSize(upload.file.size)})`}
                    </span>
                </div>
            </section>
            {progress < 100 && <Progress value={progress} className="h-1" />}
        </div>
    );
}