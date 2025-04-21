import type { Metadata } from "next";
import "@/app/globals.css";
import { EmailInputStoreProvider } from "@/zustand/providers/email-input-store-provider";

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
                <EmailInputStoreProvider>
                    {children}
                </EmailInputStoreProvider>
            </body>
        </html>
    );
}
