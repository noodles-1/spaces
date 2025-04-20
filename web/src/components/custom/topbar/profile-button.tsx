import { PenLine, UserRound } from "lucide-react";

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

export function ProfileButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex items-center h-full">
                    <Button variant="ghost" className="mx-4 h-[4rem] p-0 group cursor-pointer">
                        <div className="flex items-center w-full h-full gap-3 px-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full outline-2 outline-zinc-500 group-hover:outline-[#7076a7]">
                                <UserRound />
                            </div>
                            <span className="group-hover:text-[#bfc7ff]"> Username </span>
                        </div>
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-medium"> Profile </DialogTitle>
                    <DialogDescription> Edit your profile details </DialogDescription>
                </DialogHeader>
                <section className="flex gap-8 py-4">
                    <div className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full outline-2 group">
                        <UserRound height={50} width={50} />
                        <div className="absolute flex items-center justify-center w-full h-full transition-opacity duration-150 rounded-full opacity-0 cursor-pointer group-hover:opacity-60 bg-zinc-600">
                            <PenLine color="white" height={40} width={40} opacity={70} />
                        </div>
                    </div>
                    <section className="space-y-4 text-sm">
                        <div className="flex flex-col gap-2">
                            <span className="font-medium text-zinc-300"> Username: </span>
                            <Input />
                        </div>
                        <div className="flex gap-1">
                            <span className="font-medium text-zinc-300"> Email: </span>
                            <span> example@email.com </span>
                        </div>
                    </section>
                </section>
                <DialogFooter>
                    <Button variant="outline" className="cursor-pointer hover:text-red-300"> Logout </Button>
                    <Button className="cursor-pointer"> Save changes </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
