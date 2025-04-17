import type { Metadata } from "next";
import "@/app/globals.css";

import { DataViewStoreProvider } from "@/zustand/providers/data-view-store-provider";

import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/custom/sidebar/sidebar";
import { Topbar } from "@/components/custom/topbar/topbar";
import { ProfileButton } from "@/components/custom/topbar/profile-button";

export const metadata: Metadata = {
    title: "Home - Spaces Cloud Storage",
    description: "Spaces Personal Cloud Storage",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`dark flex h-screen antialiased`}>
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
            </body>
        </html>
    );
}
