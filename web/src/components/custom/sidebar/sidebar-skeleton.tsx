import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
    return (
        <div className="w-[16rem] flex flex-col gap-4">
            <p className="m-6 bg-[linear-gradient(to_right,#81a7ff,#abc4ff,#c3adff)] bg-[length:200%_100%] bg-clip-text bg-right text-3xl font-bold text-transparent transition-all duration-500 ease-in-out hover:bg-left">
                spaces
            </p>
            <div className="flex flex-col gap-10 mx-[1rem]">
                <Skeleton className="h-[2.4rem]" />
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 3 }).map((_, i) =>
                        <Skeleton key={i} className="h-[2.4rem]" />
                    )}
                </div>
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-[2.4rem]" />
                    <Skeleton className="h-[5rem]" />
                </div>
            </div>
        </div>
    );
}