"use client"; // Нужен, так как используем usePathname
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/team", label: "Team" },
    { href: "/dashboard/clients", label: "Clients" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-6 flex flex-col gap-4">
        <h2 className="font-bold text-lg mb-4">Admin panel</h2>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-4 py-2 rounded-md transition-colors",
              pathname === link.href
                ? "bg-slate-200 font-semibold"
                : "hover:bg-slate-100",
            )}
          >
            {link.label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
