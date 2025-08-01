import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/custom/data/list/data-table";
import { columns } from "@/components/custom/data/list/columns";
import { inaccessibleColumns } from "@/components/custom/data/list/inaccessible-columns";
import { ListViewSkeleton } from "@/components/custom/data/list/list-view-skeleton";

import { fetcher } from "@/services/fetcher";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function RootListView({
    starred,
    inaccessible
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

    const { data: userItems } = useQuery<ResponseDto<{ children: Item[] }>>({
        queryKey,
        queryFn: () => fetcher(endpoint)
    });

    if (!userItems) {
        return <ListViewSkeleton />;
    }

    if (starred) {
        return (
            <DataTable columns={columns} data={userItems.data.children} starred />
        );
    }

    if (inaccessible) {
        return (
            <DataTable columns={inaccessibleColumns} data={userItems.data.children} inaccessible />
        );
    }

    return (
        <DataTable columns={columns} data={userItems.data.children} />
    );
}
