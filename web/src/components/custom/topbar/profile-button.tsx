'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileButton() {
    const pathname = usePathname();

    return (
        <div className="h-full flex items-center">
            <Button variant="ghost" className="mx-4 h-[4rem] p-0">
                <Link href="/profile" className={`
                    w-full h-full flex items-center gap-3 px-4
                    ${pathname === "/profile" ? "text-[#bfc7ff]" : "text-zinc-300"}
                `}>
                    <div className={`
                        h-8 w-8 outline-2 rounded-full flex items-center justify-center
                        ${pathname === "/profile" ? "outline-[#7076a7]" : "outline-zinc-500"}
                    `}>
                        <UserRound />
                    </div>
                    <span> Username </span>
                </Link>
            </Button>
        </div>
    ); 
}