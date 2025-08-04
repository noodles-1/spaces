import axiosClient from "@/lib/axios-client";

import { ResponseDto } from "@/dto/response-dto";

interface ToggleItemStarredParams {
    itemId: string;
}

export async function toggleItemStarred(params: ToggleItemStarredParams): Promise<ResponseDto> {
    const response = await axiosClient.post(`/storage/starred/toggle`, params, {
        headers: { "Content-Type": "application/json" }
    });

    return response.data;
}