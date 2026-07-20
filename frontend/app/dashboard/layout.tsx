"use client"; // Нужен, так как используем usePathname
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import useHaveAccess from "@/hooks/use-have-access";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { hasPermissions, isPending } = useHaveAccess({
    employee: ["list"],
    invitation: ["list"],
  });

  const links = [
    ...(hasPermissions ? [{ href: "/dashboard/team", label: "Team" }] : []),
    ...(hasPermissions
      ? [{ href: "/dashboard/invitations", label: "Invitations" }]
      : []),
    { href: "/dashboard/clients", label: "Clients" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r pt-20 px-8 flex flex-col gap-2">
        <h2 className="font-bold text-lg mb-2 text-center">Admin panel</h2>
        {isPending ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          links.map((link) => (
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
          ))
        )}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
