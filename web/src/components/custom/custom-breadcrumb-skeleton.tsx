import { Skeleton } from "@/components/ui/skeleton";

export function CustomBreadcrumbSkeleton() {
    return (
        <main>
            <Skeleton className="h-[2rem] w-[14rem] bg-zinc-600" />
        </main>
    );
}