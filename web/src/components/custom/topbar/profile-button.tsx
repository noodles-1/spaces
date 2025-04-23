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
                    <section className="space-y-1 text-sm">
                        <section className="space-y-4 ">
                            <div className="flex flex-col gap-2">
                                <span className="font-medium text-zinc-300"> Username: </span>
                                <Input />
                            </div>
                            <div className="flex gap-1">
                                <span className="font-medium text-zinc-300"> Email: </span>
                                <span> example@email.com </span>
                            </div>
                        </section>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-300"> Connected with Github </span>
                            <svg className="h-4" fill="white" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
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
