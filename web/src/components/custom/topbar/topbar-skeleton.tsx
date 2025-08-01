import { Skeleton } from "@/components/ui/skeleton";

export function TopbarSkeleton() {
    return (
        <div className="flex-1 flex justify-end px-4">
            <Skeleton className="h-[4rem] w-[7rem]" />
        </div>
    );
}