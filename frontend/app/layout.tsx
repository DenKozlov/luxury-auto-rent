import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

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
      <body className="min-h-full flex flex-col pt-16 bg-[#121212]">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 antialiased font-sans">
          <div className="w-full px-6 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="relative w-48 h-12 hover:opacity-80 transition-opacity"
            >
              <Image src="/logo.svg" alt="ZENITH Logo" fill priority />
            </Link>
            <Link
              href="/auth"
              className="px-5 h-9 bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center border border-neutral-950 hover:bg-transparent hover:text-neutral-950 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </header>
        <Providers>{children}</Providers>
        <Script
          src="https://app.fastbots.ai/embed.js"
          data-bot-id="cmqgllhu10arxnt1pbl5wvbuf"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
