"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileButton() {
    const pathname = usePathname();

    return (
        <div className="flex h-full items-center">
            <Button variant="ghost" className="mx-4 h-[4rem] p-0">
                <Link
                    href="/profile"
                    className={`flex h-full w-full items-center gap-3 px-4 ${pathname === "/profile" ? "text-[#bfc7ff]" : "text-zinc-300"} `}
                >
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full outline-2 ${pathname === "/profile" ? "outline-[#7076a7]" : "outline-zinc-500"} `}
                    >
                        <UserRound />
                    </div>
                    <span> Username </span>
                </Link>
            </Button>
        </div>
    );
}
