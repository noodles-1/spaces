import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";

import { Progress } from "@/components/ui/progress";

import { formatFileSize } from "@/lib/custom/file-size";
import axiosClient from "@/lib/axios-client";

import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function StorageCapacity() {
    const { data: rootData } = useQuery<AxiosResponse<ResponseDto<{ children: Item[] }>>>({
        queryKey: ["user-accessible-items-recursive"],
        queryFn: () => axiosClient.get("/storage/items/accessible/children/recursive")
    });

    const [used, setUsed] = useState<number>(0);
    const capacity = Number("5e+10");

    useEffect(() => {
        const mapRootItems = () => {
            if (!rootData)
                return;

            let totalSize = 0;

            function dfs(item: Item) {
                totalSize += item.size ?? 0;
                item.children?.map(child => dfs(child));
            }

            rootData.data.data.children[0]?.children?.map(child => dfs(child));
            setUsed(totalSize);
        };
        
        mapRootItems();
    }, [rootData]);

    if (!rootData) {
        return null;
    }

    return (
        <div className="flex flex-col items-start w-full gap-1">
            <Progress
                value={(used / capacity) * 100}
                className="w-full h-1 bg-zinc-700"
            />
            <span className="text-[0.8rem] font-light">
                {formatFileSize(used)} of {formatFileSize(capacity)} used
            </span>
        </div>
    );
}
