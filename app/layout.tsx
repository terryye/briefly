import { TRPCReactProvider } from "@/trpc/react";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import Dock from "./components/ui/Dock";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Briefly",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
                />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div className="flex flex-col h-screen">
                    <div className="overflow-auto">
                        <TRPCReactProvider>
                            <SessionProvider>{children}</SessionProvider>
                        </TRPCReactProvider>
                    </div>
                    <div style={{ minHeight: 64 }}>{/* space for dock*/}</div>
                </div>
                <Dock />
            </body>
        </html>
    );
}
