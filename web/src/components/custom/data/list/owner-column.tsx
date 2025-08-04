import { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";

import { OwnerColumnAvatar } from "@/components/custom/data/list/owner-column-avatar";

import axiosClient from "@/lib/axios-client";
import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function OwnerColumn({
    item
}: {
    item: Item
}) {
    const { data: ownerUserIdData } = useQuery<AxiosResponse<ResponseDto<{ ownerUserId: string | null }>>>({
        queryKey: ["item-owner-id", item.id],
        queryFn: () => axiosClient.get(`/storage/items/public/owner-user-id/${item.id}`)
    });

    if (!ownerUserIdData) {
        return null;
    }

    const ownerUserId = ownerUserIdData.data.data.ownerUserId;

    if (!ownerUserId) {
        return null;
    }

    return (
        <OwnerColumnAvatar ownerUserId={ownerUserId} />
    );
}