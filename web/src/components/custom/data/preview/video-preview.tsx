import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { Play } from "lucide-react";

import axiosClient from "@/lib/axios-client";
import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";
import { Skeleton } from "@/components/ui/skeleton";

export function VideoPreview({
    file,
}: {
    file: Item
}) {
    const { data: imagePreviewData } = useQuery<AxiosResponse<ResponseDto<{ downloadUrl: string }>>>({
        queryKey: ["video-preview", file.id],
        queryFn: () => axiosClient.post("/storage/public/generate-thumbnail-download-url", {
            fileId: file.id,
            filename: file.name
        }, {
            headers: { "Content-Type": "application/json" },
        })
    });

    if (!imagePreviewData) {
        return <Skeleton className="h-full flex-1 bg-zinc-600 rounded" />;
    }

    const imagePreview = imagePreviewData.data.data.downloadUrl;

    return (
        <div className="h-full w-full relative">
            <div className="absolute h-full w-full flex items-center justify-center">
                <div className="h-[2.5rem] w-[2.5rem] bg-zinc-600 opacity-80 rounded-full flex items-center justify-center">
                    <Play className="stroke-spaces-secondary" />
                </div>
            </div>
            <img src={imagePreview} className="h-full w-full rounded object-cover" />
        </div>
    );
}