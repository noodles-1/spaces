import type { Metadata } from "next";
import "@/app/globals.css";

import TanstackProvider from "@/tanstack/provider";

import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "Login - Spaces Cloud Storage",
    description: "Spaces Personal Cloud Storage",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any"/>
            </head>
            <body className={`dark flex h-screen antialiased`}>
                <TanstackProvider>
                    {children}
                    <Toaster />
                </TanstackProvider>
            </body>
        </html>
    );
}
