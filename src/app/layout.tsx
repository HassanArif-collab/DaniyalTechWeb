import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DaniyalTech - Premium Electronics Pakistan",
  description: "Shop premium electronics online — mobile phones, AirPods, chargers & accessories. Cash on Delivery available across Pakistan. Brand warranty on all products.",
  keywords: ["electronics", "Pakistan", "mobile phones", "AirPods", "chargers", "COD", "brand warranty"],
  openGraph: {
    title: "DaniyalTech - Premium Electronics Pakistan",
    description: "Shop premium electronics with Cash on Delivery across Pakistan",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <LayoutShell>{children}</LayoutShell>
        <Toaster />
      </body>
    </html>
  );
}
