import Link from "next/link";

import { Ancestor } from "@/types/ancestor-type";

import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
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

export function CustomBreadcrumb({
    currentFolder,
    ancestors,
}: {
    currentFolder: string
    ancestors: Ancestor[]
}) {
    const root = ancestors[0];
    const n = ancestors.length;

    return (
        <Breadcrumb>
            <BreadcrumbList className="text-xl">
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/${root.folderName}`} className="capitalize"> {root.folderName} </BreadcrumbLink>
                </BreadcrumbItem>
            {ancestors.length === 3 &&
                <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/folders/${ancestors[n - 2].folderId}`}> {ancestors[n - 2].folderName} </BreadcrumbLink>
                    </BreadcrumbItem>
                </>
            }
            {ancestors.length > 3 &&
                <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1">
                                <BreadcrumbEllipsis className="w-4 h-4 cursor-pointer hover:text-white" />
                                <span className="sr-only"> Toggle menu </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="p-2 space-y-2">
                                {ancestors.slice(1, n - 1).map((ancestor, i) =>
                                    <DropdownMenuItem key={i} className="cursor-pointer">
                                        <Link href={`/folders/${ancestor.folderId}`}> {ancestor.folderName} </Link>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </BreadcrumbItem>
                </>
            }
            {ancestors.length >= 2 &&
                <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/folders/${ancestors[n - 1].folderId}`}> {ancestors[n - 1].folderName} </BreadcrumbLink>
                    </BreadcrumbItem>
                </>
            }
            <BreadcrumbSeparator />
            <BreadcrumbItem>
                <BreadcrumbPage> {currentFolder} </BreadcrumbPage>
            </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}