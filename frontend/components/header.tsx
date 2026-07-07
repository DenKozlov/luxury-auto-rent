"use client";

import Image from "next/image";
import Link from "next/link";
import AuthMenu from "./auth-menu";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  if (pathname === "/auth") {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 antialiased font-sans">
      <div className="w-full px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="relative w-48 h-12 hover:opacity-80 transition-opacity"
        >
          <Image src="/logo.svg" alt="ZENITH Logo" fill priority />
        </Link>
        <AuthMenu />
      </div>
    </header>
  );
};

export default Header;
