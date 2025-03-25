'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Home, Star, Database, Trash, Plus } from "lucide-react";

const items = [
    {
        title: "Home",
        url: "/home",
        icon: Home,
    },
    {
        title: "Starred",
        url: "/starred",
        icon: Star,
    },
    {
        title: "Trash",
        url: "/trash",
        icon: Trash,
    },
    {
        title: "Storage",
        url: "/storage",
        icon: Database,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="h-full w-[16rem]">
            <div 
                className="font-bold text-3xl bg-gradient-to-r from-[#abc4ff] to-[#6072ff] bg-clip-text text-transparent m-6"> 
                spaces 
            </div>
            <section className="flex justify-center">
                <div className="flex flex-col gap-4 w-[90%] mt-5">
                    <div className="w-full">
                        <Button
                            variant="secondary"
                            className="w-full hover:cursor-pointer p-0 rounded-xl"
                        >
                            <div className="flex items-center gap-4 text-left w-full px-6">
                                <Plus className="stroke-[4px]" />
                                <span> New folder </span>
                            </div>
                        </Button>
                    </div>
                    {items.map((item: typeof items[0], idx: number) => (
                        <Button 
                            variant="outline" 
                            key={idx} 
                            className={`w-full p-0 rounded-xl ${idx % 2 === 0 ? "mt-5" : ""}`}
                        >
                            <Link 
                                href={item.url} 
                                className={`flex items-center gap-4 w-full h-full px-6 ${pathname === item.url ? "text-[#bfc7ff]" : ""}`}
                            >
                                <item.icon/>
                                <span> {item.title} </span>
                            </Link>
                        </Button>
                    ))}
                </div>
            </section>
        </div>
    )
}
