import { Skeleton } from "@/components/ui/skeleton";

export function GridViewSkeleton() {
    return (
        <main className="flex flex-col gap-12">
            <section className="flex flex-col gap-6">
                <Skeleton className="h-[1rem] w-[4rem] bg-zinc-600" />
                <div className="flex gap-4">
                    {Array.from({ length: 2 }).map((_, idx) =>
                        <Skeleton key={idx} className="h-[3rem] w-[12rem] bg-zinc-600" />
                    )}
                </div>
            </section>
            <section className="flex flex-col gap-6">
                <Skeleton className="h-[1rem] w-[4rem] bg-zinc-600" />
                <div className="flex gap-4">
                    {Array.from({ length: 3 }).map((_, idx) =>
                        <Skeleton key={idx} className="h-[8rem] w-[12rem] bg-zinc-600" />
                    )}
                </div>
            </section>
        </main>
    );
}