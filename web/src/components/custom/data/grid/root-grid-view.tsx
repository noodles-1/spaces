import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { GridView } from "@/components/custom/data/grid/grid-view";

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
        endpoint = "/storage/items/accessible/starred";
    }
    else if (inaccessible) {
        queryKey = ["user-inaccessible-items"];
        endpoint = "/storage/items/inaccessible/children";
    }
        
    const { data: userItems } = useSuspenseQuery<ResponseDto<{ children: Item[] }>>({
        queryKey,
        queryFn: () => fetcher(endpoint)
    });

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
