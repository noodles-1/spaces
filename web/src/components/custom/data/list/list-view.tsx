import { DataTable } from "@/components/custom/data/list/data-table";
import { columns } from "@/components/custom/data/list/columns";

import { LIST_ITEMS } from "@/constants/data/placeholder";

export function ListView() {
    return (
        <div>
            <DataTable columns={columns} data={LIST_ITEMS} />
        </div>
    );
}