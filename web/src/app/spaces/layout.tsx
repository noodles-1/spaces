import React from "react";

import { DataViewStoreProvider } from "@/zustand/providers/data-view-store-provider";

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
                        <ProfileButton />
                    </div>
                    <div className="flex flex-col overflow-hidden grow rounded-tl-2xl bg-zinc-800">
                        <DataViewStoreProvider>
                            {children}
                        </DataViewStoreProvider>
                    </div>
                </section>
            </main>
        </section>
    );
}