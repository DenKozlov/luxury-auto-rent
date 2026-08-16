import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QCProvider from "@/components/providers/query-client-provider";
// import Script from "next/script";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZENITH | Luxury Fleet",
  description: "Luxury rencitng car service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <QCProvider>{children}</QCProvider>
        {/* <Script
          src="https://app.fastbots.ai/embed.js"
          data-bot-id="cmqgllhu10arxnt1pbl5wvbuf"
          strategy="beforeInteractive"
        /> */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
