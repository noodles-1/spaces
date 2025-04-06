import { Progress } from "@/components/ui/progress";

export function StorageCapacity() {
    const capacity = 50;
    const used = 14;

    return (
        <div className="flex w-full flex-col items-start gap-1">
            <Progress
                value={(used / capacity) * 100}
                className="h-1 w-full bg-zinc-700"
            />
            <span className="text-[0.8rem] font-light">
                {" "}
                {used} GB of {capacity} GB used{" "}
            </span>
        </div>
    );
}
