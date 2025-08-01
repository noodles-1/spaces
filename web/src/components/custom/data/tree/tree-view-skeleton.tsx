import { Skeleton } from "@/components/ui/skeleton";

export function TreeViewSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <Skeleton className="w-[14rem] h-[2rem] bg-zinc-700" />
                <Skeleton className="w-[10rem] h-[2rem] bg-zinc-700" />
            </div>
            <div className="flex justify-between items-center">
                <Skeleton className="w-[6rem] h-[2rem] bg-zinc-700" />
                <Skeleton className="w-[18rem] h-[2rem] bg-zinc-700" />
            </div>
        </div>
    );
}