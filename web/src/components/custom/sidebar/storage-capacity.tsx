import { Progress } from "@/components/ui/progress";

export function StorageCapacity() {
    const capacity = 50;
    const used = 14;
    
    return (
        <div className="flex flex-col items-start gap-1 w-full">
            <Progress value={(used / capacity) * 100} className="w-full h-1 bg-zinc-700" />
            <span className="font-light text-[0.8rem]"> {used} GB of {capacity} GB used </span>
        </div>
    );
}