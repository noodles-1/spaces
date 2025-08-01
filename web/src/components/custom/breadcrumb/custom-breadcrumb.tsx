import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomBreadcrumbSkeleton } from "@/components/custom/breadcrumb/custom-breadcrumb-skeleton";

import axiosClient from "@/lib/axios-client";
import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function CustomBreadcrumb({
    folderId,
}: {
    folderId: string;
}) {
    const { data: ancestorItems } = useQuery<AxiosResponse<ResponseDto<{ ancestors: Item[] }>>>({
        queryKey: ["owner-ancestor-items", folderId],
        queryFn: () => axiosClient.get(`/storage/items/owner-ancestors/${folderId}`)
    });

    if (!ancestorItems) {
        return <CustomBreadcrumbSkeleton />;
    }

    const ancestors = ancestorItems.data.data.ancestors;
    const n = ancestors.length;

    return (
        <Breadcrumb>
            <BreadcrumbList className="text-xl">
                <BreadcrumbItem>
                    <Link href={`/spaces/home`} className="capitalize"> Home </Link>
                </BreadcrumbItem>
                {ancestors.length === 4 &&
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link href={`/spaces/folders/${ancestors[n - 3].id}`}> {ancestors[n - 3].name} </Link>
                        </BreadcrumbItem>
                    </>
                }
                {ancestors.length > 4 &&
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">
                                    <BreadcrumbEllipsis className="w-4 h-4 cursor-pointer hover:text-white" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="p-2 space-y-2">
                                    {ancestors.slice(1, n - 2).map((ancestor, i) =>
                                        <DropdownMenuItem key={i} className="cursor-pointer">
                                            <Link href={`/spaces/folders/${ancestor.id}`} className="flex-1"> {ancestor.name} </Link>
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                    </>
                }
                {ancestors.length >= 3 &&
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link href={`/spaces/folders/${ancestors[n - 2].id}`}> {ancestors[n - 2].name} </Link>
                        </BreadcrumbItem>
                    </>
                }
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage> {ancestors[n - 1].name} </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}