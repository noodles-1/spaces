import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { GridView } from "@/components/custom/data/grid/grid-view";

import { fetcher } from "@/actions/fetcher";
import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function RootGridView() {
    const { data: userItems } = useSuspenseQuery<ResponseDto<{ children: Item[] }>>({
        queryKey: ["user-accessible-items"],
        queryFn: () => fetcher("/storage/items/accessible/children")
    });

    return (
        <GridView userItems={userItems} />
    );
}
