import { DropdownItem } from "@/types/dropdown-items-type";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { EllipsisVertical } from "lucide-react";

export function EllipsisDropdown({
    itemGroups,
    className,
}: {
    itemGroups: DropdownItem[][];
    className?: string;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className={className}>
                <Button
                    variant="secondary"
                    className="h-7 w-7 rounded-full bg-transparent hover:bg-zinc-700 hover:cursor-pointer"
                >
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {itemGroups.map((group, i) => (
                    <section key={i}>
                        <DropdownMenuGroup className="space-y-2 p-1">
                            {group.map((item, j) => (
                                <DropdownMenuItem
                                    key={j}
                                    className="flex gap-3 pr-12 hover:cursor-pointer"
                                >
                                    <item.icon />
                                    {item.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>
                        {i < itemGroups.length - 1 && <DropdownMenuSeparator />}
                    </section>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
