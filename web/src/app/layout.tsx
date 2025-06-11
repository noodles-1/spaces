import type { Metadata } from "next";
import "@/app/globals.css";

import TanstackProvider from "@/tanstack/provider";

import { Toaster } from "@/components/ui/sonner";
import { UploadStoreProvider } from "@/zustand/providers/upload-store-provider";
import { DownloadStoreProvider } from "@/zustand/providers/download-store-provider";

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
                    <UploadStoreProvider>
                        <DownloadStoreProvider>
                            {children}
                            <Toaster expand />
                        </DownloadStoreProvider>
                    </UploadStoreProvider>
                </TanstackProvider>
            </body>
        </html>
    );
}
