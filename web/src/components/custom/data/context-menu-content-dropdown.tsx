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
    itemGroups?: DropdownItem[][];
}) {
    return (
        <ContextMenuContent className="bg-zinc-950">
            {itemGroups ? (
                itemGroups.map((group, i) => (
                    <section key={i}>
                        <ContextMenuGroup className="space-y-2 p-1">
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
                ))
            ) : (
                <p className="p-2 pr-12 text-sm text-zinc-300">
                    No selected item(s).
                </p>
            )}
        </ContextMenuContent>
    );
}
