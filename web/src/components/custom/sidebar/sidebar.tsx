"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Home, Star, Database, Trash, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StorageCapacity } from "@/components/custom/sidebar/storage-capacity";
import { NewFolder } from "@/components/custom/sidebar/new-folder";

const items = [
    {
        title: "Home",
        url: "/spaces/home",
        icon: Home,
    },
    {
        title: "Starred",
        url: "/spaces/starred",
        icon: Star,
    },
    {
        title: "Trash",
        url: "/spaces/trash",
        icon: Trash,
    },
    {
        title: "Storage",
        url: "/spaces/storage",
        icon: Database,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="h-full min-w-[16rem]">
            <Link href="/spaces/home">
                <p className="m-6 bg-[linear-gradient(to_right,#81a7ff,#abc4ff,#c3adff)] bg-[length:200%_100%] bg-clip-text bg-right text-3xl font-bold text-transparent transition-all duration-500 ease-in-out hover:bg-left">
                    spaces
                </p>
            </Link>
            <section className="flex justify-center">
                <div className="mt-5 flex w-[90%] flex-col gap-4">
                    <NewFolder />
                    {items.map((item: (typeof items)[0], idx: number) => (
                        <Button
                            variant="outline"
                            key={idx}
                            className={`w-full rounded-xl p-0 ${idx % 2 === 0 && "mt-5"} ${item.title === "Storage" && "h-fit"} `}
                        >
                            <Link
                                href={item.url}
                                className={`flex h-full w-full px-6 ${pathname === item.url && "text-[#bfc7ff]"} ${item.title === "Storage" && "my-3 flex-col items-start justify-center gap-2"} `}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon />
                                    <span className="font-normal">
                                        {" "}
                                        {item.title}{" "}
                                    </span>
                                </div>
                                {item.title === "Storage" && (
                                    <StorageCapacity />
                                )}
                            </Link>
                        </Button>
                    ))}
                </div>
            </section>
        </div>
    );
}
