import React from "react";

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
                <section className="flex grow flex-col">
                    <div className="flex min-h-[6rem] items-center">
                        <Topbar />
                        <ProfileButton />
                    </div>
                    <div className="grow overflow-hidden rounded-tl-2xl bg-zinc-800 p-6">
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