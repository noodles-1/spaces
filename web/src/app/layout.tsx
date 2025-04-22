import type { Metadata } from "next";
import "@/app/globals.css";

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
                {children}
            </body>
        </html>
    );
}
