import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import axiosClient from "@/lib/axios-client";
import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";
import { Skeleton } from "@/components/ui/skeleton";

export function ImagePreview({
    file,
}: {
    file: Item
}) {
    const { data: imagePreviewData } = useQuery<AxiosResponse<ResponseDto<{ downloadUrl: string }>>>({
        queryKey: ["image-preview", file.id],
        queryFn: () => axiosClient.post("/storage/generate-download-url", {
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

    return <img src={imagePreview} className="h-full w-full rounded object-cover" />;
}