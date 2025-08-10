import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { FileWithPath } from "react-dropzone";

import { CircleX } from "lucide-react";

import { FileIcon } from "@/components/custom/data/file-icon";
import { Progress } from "@/components/ui/progress";

import { createItem, uploadFile, uploadThumbnail } from "@/services/storage";
import { useUploadStore } from "@/zustand/providers/upload-store-provider";
import { formatFileSize } from "@/lib/custom/file-size";
import { customToast } from "@/lib/custom/custom-toast";
import axiosClient from "@/lib/axios-client";

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

    const paths = pathname.split("/");
    const parentId = paths.length === 4 ? paths[3] : undefined;

    const { data: ownerUserIdData } = useQuery<AxiosResponse<ResponseDto<{ ownerUserId: string }>>>({
        queryKey: ["item-owner-id", parentId],
        queryFn: () => axiosClient.get(`/storage/items/public/owner-user-id/${parentId}`)
    });

    const hasRun = useRef<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [thumbnail, setThumbnail] = useState<FileWithPath | null>(null);
    const [fileId, setFileId] = useState<string | null>("");

    const createItemMutation = useMutation({
        mutationFn: createItem
    });
    const queryClient = useQueryClient();

    const generateThumbnail = (file: FileWithPath) => {
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");

        video.src = url;
        video.crossOrigin = "anonymous";
        video.muted = true;
        video.playsInline = true;

        video.addEventListener("loadedmetadata", () => {
            video.currentTime = Math.min(1, video.duration / 2);
        });

        video.addEventListener("seeked", () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL("image/jpeg", 0.8);

                const thumbnailFile = dataURLtoFileWithPath(
                    dataURL,
                    file.name.replace(/\.[^/.]+$/, "") + "_thumbnail.jpg"
                );

                setThumbnail(thumbnailFile);
                URL.revokeObjectURL(url);
            }
        });
    };

    const dataURLtoFileWithPath = (dataURL: string, filename: string): FileWithPath => {
        const arr = dataURL.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        const file = new File([u8arr], filename, { type: mime }) as FileWithPath;
        return file;
    };

    useEffect(() => {
        const handleThumbnailUpload = async () => {
            if (thumbnail && fileId) {
                await uploadThumbnail({
                    fileId,
                    thumbnail
                });

                queryClient.invalidateQueries({
                    queryKey: ["user-accessible-items"]
                });

                if (parentId) {
                    queryClient.invalidateQueries({
                        queryKey: ["user-accessible-items", parentId]
                    });
                }
            }
        };

        handleThumbnailUpload();
    }, [thumbnail, fileId]);

    useEffect(() => {
        if (!ownerUserIdData)
            return;

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
    
                    await createItemMutation.mutateAsync({
                        id: uploadResponse.fileId,
                        name: upload.file.name,
                        ownerUserId: ownerUserIdData.data.data.ownerUserId,
                        type: "FILE",
                        parentId,
                        contentType: upload.file.type,
                        size: upload.file.size
                    });

                    console.log(upload.file.type)

                    if (upload.file.type.startsWith("video/")) {
                        setFileId(uploadResponse.fileId);
                        generateThumbnail(upload.file);
                    }
    
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
    }, [ownerUserIdData]);

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