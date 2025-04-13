import { DataTable } from "@/components/custom/data/list/data-table";
import { columns } from "@/components/custom/data/list/columns";

import { FILES } from "@/constants/data/placeholder";

export function ListView() {
    return (
        <div>
            <DataTable columns={columns} data={FILES} />
        </div>
    );
}