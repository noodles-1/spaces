import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/custom/data/list/data-table";
import { columns } from "@/components/custom/data/list/columns";

import { fetcher } from "@/actions/fetcher";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function RootListView({
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
            <DataTable columns={columns} data={userItems.data.children} starred />
        );
    }

    return (
        <DataTable columns={columns} data={userItems.data.children} />
    );
}
