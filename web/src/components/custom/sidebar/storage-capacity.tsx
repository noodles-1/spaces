import { Progress } from "@/components/ui/progress";

export function StorageCapacity() {
    const capacity = 50;
    const used = 14;

    return (
        <div className="flex flex-col items-start w-full gap-1">
            <Progress
                value={(used / capacity) * 100}
                className="w-full h-1 bg-zinc-700"
            />
            <span className="text-[0.8rem] font-light">
                {used} GB of {capacity} GB used
            </span>
        </div>
    );
}
