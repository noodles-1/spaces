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
import { UserPermission } from "@/types/user-permission-type";

export function PublicCustomBreadcrumb({
    folderId,
    permission,
}: {
    folderId: string;
    permission: UserPermission;
}) {
    const { data: ancestorItems } = useQuery<AxiosResponse<ResponseDto<{ ancestors: Item[] }>>>({
        queryKey: ["ancestor-items", folderId],
        queryFn: () => axiosClient.get(`/storage/items/public/owner-ancestors/${folderId}/${permission.item.id}`)
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
                    <Link 
                        href={`/spaces/folders/${ancestors[0].id}`}
                        className={`${folderId === ancestors[0].id && "text-white"}`}
                    > 
                        {ancestors[0].name} 
                    </Link>
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
                {ancestors.length > 2 &&
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link href={`/spaces/folders/${ancestors[n - 2].id}`}> {ancestors[n - 2].name} </Link>
                        </BreadcrumbItem>
                    </>
                }
                {ancestors.length > 1 &&
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage> {ancestors[n - 1].name} </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                }
            </BreadcrumbList>
        </Breadcrumb>
    );
}