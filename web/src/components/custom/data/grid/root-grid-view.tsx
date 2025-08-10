import React from "react";
import { useQuery } from "@tanstack/react-query";

import { GridView } from "@/components/custom/data/grid/grid-view";
import { GridViewSkeleton } from "@/components/custom/data/grid/grid-view-skeleton";

import { fetcher } from "@/services/fetcher";
import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function RootGridView({
    starred,
    shared,
    inaccessible,
}: {
    starred?: boolean
    shared?: boolean
    inaccessible?: boolean
}) {
    let queryKey = ["user-accessible-items"];
    let endpoint = "/storage/items/accessible/children";

    if (starred) {
        queryKey = ["user-accessible-starred-items"];
        endpoint = "/storage/items/starred";
    }
    else if (shared) {
        queryKey = ["user-accessible-shared-items"];
        endpoint = "/storage/items/shared";
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

    const sortedItems = userItems.data.children.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    if (starred) {
        return (
            <GridView items={sortedItems} starred />
        );
    }

    if (shared) {
        return (
            <GridView items={sortedItems} shared />
        );
    }

    if (inaccessible) {
        return (
            <GridView items={sortedItems} inaccessible />
        );
    }

    return (
        <GridView items={sortedItems} />
    );
}
