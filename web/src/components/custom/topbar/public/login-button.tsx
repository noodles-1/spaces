import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PublicLoginButton() {
    return (
        <Link href="/login">
            <Button variant="ghost" className="mx-4 h-[4rem] p-0 group cursor-pointer">
                <div className="flex items-center w-full h-full gap-3 px-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full outline-2 outline-zinc-500 group-hover:outline-[#7076a7]">
                        <UserRound />
                    </div>
                    <span className="group-hover:text-[#bfc7ff]"> Log-in to Spaces </span>
                </div>
            </Button>
        </Link>
    );
}