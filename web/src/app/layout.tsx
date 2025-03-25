import type { Metadata } from "next";
import "@/app/globals.css";

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
            <body
                className={`antialiased dark h-screen flex`}
            >
                <main className="h-full w-full bg-transparent backdrop-blur-[4px] flex">
                    <Sidebar />
                    <section className="grow flex flex-col">
                        <div className="flex items-center h-[6rem]">
                            <Topbar />
                            <ProfileButton />
                        </div>
                        <div className="bg-zinc-800 grow p-6 rounded-tl-2xl">
                            {children}
                        </div>
                    </section>
                </main>
            </body>
        </html>
    );
}
