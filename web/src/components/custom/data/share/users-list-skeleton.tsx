import { Skeleton } from "@/components/ui/skeleton";

export function UsersListSkeleton() {
    return (
        <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                <Skeleton className="rounded-lg w-[4rem] h-[1rem] bg-zinc-600" />
                <Skeleton className="rounded-lg w-full h-[4rem] bg-zinc-600" />
            </div>
            <div className="flex flex-col gap-3">
                <Skeleton className="rounded-lg w-[4rem] h-[1rem] bg-zinc-600" />
                {Array.from({ length: 2 }).map((_, i) =>
                    <Skeleton key={i} className="rounded-lg w-full h-[4rem] bg-zinc-600" />
                )}
            </div>
        </div>
    );
}