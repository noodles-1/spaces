import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { GridView } from "@/components/custom/data/grid/grid-view";

import { fetcher } from "@/actions/fetcher";
import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function RootGridView({
    starred
}: {
    starred?: boolean
}) {
    const queryKey = starred
        ? ["user-accessible-starred-items"]
        : ["user-accessible-items"];

    const endpoint = starred
        ? "/storage/items/accessible/starred"
        : "/storage/items/accessible/children";

    const { data: userItems } = useSuspenseQuery<ResponseDto<{ children: Item[] }>>({
        queryKey,
        queryFn: () => fetcher(endpoint)
    });

    if (starred) {
        return (
            <GridView userItems={userItems} starred />
        );
    }

    return (
        <GridView userItems={userItems} />
    );
}
