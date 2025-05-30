import { Skeleton } from "@/components/ui/skeleton";

export function ListViewSkeleton() {
    return (
        <main className="flex flex-col gap-8">
            <section className="flex gap-3">
                <Skeleton className="h-[2rem] w-[6rem] bg-zinc-600" />
                <Skeleton className="h-[2rem] w-[10rem] bg-zinc-600" />
            </section>
            <section className="flex flex-col gap-6">
                {Array.from({ length: 3 }).map((_, i) =>
                    <section key={i} className="grid grid-cols-4 gap-30">
                        {Array.from({ length: 4 }).map((_, j) =>
                            <Skeleton key={j} className="h-[1rem] flex-1 bg-zinc-600" />
                        )}
                    </section>
                )}
            </section>
        </main>
    );
}