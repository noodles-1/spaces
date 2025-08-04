import React from "react";
import { useQuery } from "@tanstack/react-query";

import { GridView } from "@/components/custom/data/grid/grid-view";
import { GridViewSkeleton } from "@/components/custom/data/grid/grid-view-skeleton";

import { fetcher } from "@/services/fetcher";
import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function RootGridView({
    starred,
    inaccessible,
}: {
    starred?: boolean
    inaccessible?: boolean
}) {
    let queryKey = ["user-accessible-items"];
    let endpoint = "/storage/items/accessible/children";

    if (starred) {
        queryKey = ["user-accessible-starred-items"];
        endpoint = "/storage/starred/items";
    }
    else if (inaccessible) {
        queryKey = ["user-inaccessible-items"];
        endpoint = "/storage/items/inaccessible/children";
    }
        
    const { data: userItems } = useQuery<ResponseDto<{ children: Item[] }>>({
        queryKey,
        queryFn: () => fetcher(endpoint)
    });

    if (!userItems) {
        return <GridViewSkeleton />;
    }

    if (starred) {
        return (
            <GridView userItems={userItems} starred />
        );
    }

    if (inaccessible) {
        return (
            <GridView userItems={userItems} inaccessible />
        );
    }

    return (
        <GridView userItems={userItems} />
    );
}
