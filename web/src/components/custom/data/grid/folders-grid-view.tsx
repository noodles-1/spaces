import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { GridView } from "@/components/custom/data/grid/grid-view";

import { fetcher } from "@/actions/fetcher";
import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function FoldersGridView({
    parentId
}: {
    parentId: string
}) {
    const { data: userItems } = useSuspenseQuery<ResponseDto<{ children: Item[] }>>({
        queryKey: ["user-accessible-items", parentId],
        queryFn: () => fetcher(`/storage/items/children/${parentId}`)
    });

    return (
        <GridView userItems={userItems} />
    );
}
