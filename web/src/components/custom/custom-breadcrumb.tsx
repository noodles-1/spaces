import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";

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

import { fetcher } from "@/services/fetcher";
import { ResponseDto } from "@/dto/response-dto";
import { Item } from "@/types/item-type";

export function CustomBreadcrumb({
    folderId
}: {
    folderId: string
}) {
    const { data: ancestorItems } = useSuspenseQuery<ResponseDto<{ ancestors: Item[] }>>({
        queryKey: ["owner-ancestor-items", folderId],
        queryFn: () => fetcher(`/storage/items/owner-ancestors/${folderId}`)
    });

    const ancestors = ancestorItems.data.ancestors;
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
                                <span className="sr-only"> Toggle menu </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="p-2 space-y-2">
                                {ancestors.slice(1, n - 2).map((ancestor, i) =>
                                    <DropdownMenuItem key={i} className="cursor-pointer">
                                        <Link href={`/spaces/folders/${ancestor.id}`}> {ancestor.name} </Link>
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