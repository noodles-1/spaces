import type { Metadata } from "next";
import "@/app/globals.css";

import { AppSidebar } from "@/components/custom/app-sidebar";
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
                className={`antialiased dark h-screen p-20 flex gap-4`}
            >
                <AppSidebar />
                <section className="flex flex-col gap-4 grow">
                    <section className="h-[5rem] flex gap-4">
                        <Topbar />
                        <ProfileButton />
                    </section>
                    <div className="bg-transparent backdrop-blur-sm outline-1 rounded-md h-full">
                        <div className="grow">
                            {children}
                        </div>
                    </div>
                </section>
            </body>
        </html>
    );
}
