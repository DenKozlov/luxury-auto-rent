"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="w-full h-[calc(100vh-64px)] bg-[#f4f7f9] flex flex-col items-center justify-center overflow-hidden p-4 font-[var(--font-geist-sans),sans-serif]">
      <div className="relative w-full max-w-4xl flex flex-col items-center justify-center">
        <div className="relative w-full aspect-4/3 max-h-[55vh] scale-135 sm:scale-150 md:scale-125 select-none pointer-events-none transform -translate-y-4">
          <Image
            src="/oops.webp"
            alt="Something went wrong"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-[-5%] sm:bottom-0 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center gap-3 w-full max-w-xs px-4">
          <Button
            onClick={() => reset()}
            className="px-8 h-9 cursor-pointer bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center border border-neutral-950 hover:bg-transparent hover:text-neutral-950 transition-all duration-200"
          >
            Retry
          </Button>
          {!isHomePage && (
            <Link
              href="/"
              className="h-9 px-8 rounded-lg whitespace-nowrap bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center border border-neutral-950 hover:bg-transparent hover:text-neutral-950 transition-all duration-200"
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
