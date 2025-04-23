"use client"

import React from "react";

import { SessionProvider } from "next-auth/react";

import { DataViewStoreProvider } from "@/zustand/providers/data-view-store-provider";

import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/custom/sidebar/sidebar";
import { Topbar } from "@/components/custom/topbar/topbar";
import { ProfileButton } from "@/components/custom/topbar/profile-button";

export default function SpacesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="w-screen">
            <main className="flex h-full w-full bg-transparent backdrop-blur-[4px]">
                <Sidebar />
                <section className="flex flex-col grow">
                    <div className="flex min-h-[6rem] items-center">
                        <Topbar />
                        <SessionProvider>
                            <ProfileButton />
                        </SessionProvider>
                    </div>
                    <div className="p-6 overflow-hidden grow rounded-tl-2xl bg-zinc-800">
                        <DataViewStoreProvider>
                            {children}
                        </DataViewStoreProvider>
                    </div>
                </section>
            </main>
            <Toaster />
        </section>
    );
}