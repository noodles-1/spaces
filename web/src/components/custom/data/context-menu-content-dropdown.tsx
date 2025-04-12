import { DropdownItem } from "@/types/dropdown-items-type";

import {
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuSeparator,
} from "@/components/ui/context-menu";

export function ContextMenuContentDropdown({
    itemGroups,
}: {
    itemGroups: DropdownItem[][];
}) {
    return (
        <ContextMenuContent>
            {itemGroups.map((group, i) => (
                <section key={i}>
                    <ContextMenuGroup className="p-1 space-y-2">
                        {group.map((item, j) => (
                            <ContextMenuItem
                                key={j}
                                className="flex gap-3 pr-12 hover:cursor-pointer"
                            >
                                <item.icon />
                                {item.label}
                            </ContextMenuItem>
                        ))}
                    </ContextMenuGroup>
                    {i < itemGroups.length - 1 && <ContextMenuSeparator />}
                </section>
            ))}
        </ContextMenuContent>
    );
}
