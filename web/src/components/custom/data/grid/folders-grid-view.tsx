import React from "react";
import { useQuery } from "@tanstack/react-query";

import { GridView } from "@/components/custom/data/grid/grid-view";
import { GridViewSkeleton } from "@/components/custom/data/grid/grid-view-skeleton";

import { fetcher } from "@/services/fetcher";
import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function FoldersGridView({
    parentId
}: {
    parentId: string
}) {
    const { data: userItems } = useQuery<ResponseDto<{ children: Item[] }>>({
        queryKey: ["user-accessible-items", parentId],
        queryFn: () => fetcher(`/storage/items/public/children/${parentId}`)
    });

    if (!userItems) {
        return <GridViewSkeleton />;
    }

    return (
        <GridView userItems={userItems} />
    );
}
