import { Plus } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewFolder() {
    return (
        <Dialog>
            <DialogTrigger>
                <div className="w-full">
                    <Button
                        variant="secondary"
                        className="w-full p-0 rounded-xl hover:cursor-pointer"
                    >
                        <div className="flex items-center w-full gap-4 px-6 text-left">
                            <Plus className="stroke-[4px]" />
                            <span> New folder </span>
                        </div>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-zinc-800 w-[28rem]">
                <DialogHeader>
                    <DialogTitle className="font-medium"> New folder </DialogTitle>
                    <DialogDescription> Create new folder on this current directory </DialogDescription>
                </DialogHeader>
                <main className="flex flex-col gap-2 pb-4">
                    <span className="font-medium text-zinc-300 text-sm"> Folder name: </span>
                    <Input placeholder="example: folder-1" />
                </main>
                <DialogFooter>
                    <Button className="cursor-pointer">
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}