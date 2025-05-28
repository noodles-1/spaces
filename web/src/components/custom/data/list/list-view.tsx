import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/custom/data/list/data-table";
import { columns } from "@/components/custom/data/list/columns";

import { fetcher } from "@/actions/fetcher";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function ListView() {
    const { data: userItems } = useSuspenseQuery<ResponseDto<{ children: Item[] }>>({
        queryKey: ["user-accessible-items"],
        queryFn: () => fetcher("/storage/items/accessible/children")
    });

    return (
        <div>
            <DataTable columns={columns} data={userItems.data.children} />
        </div>
    );
}
