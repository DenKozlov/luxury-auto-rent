"use client";

import { useSession, signOut } from "@/lib/actions/auth-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "./ui/button";
import { UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import useHaveAccess from "@/hooks/use-have-access";

const AuthMenu = () => {
  const { data: session, isPending } = useSession();
  const { hasPermissions } = useHaveAccess({
    employee: ["list"],
    invitation: ["list"],
  });

  if (isPending) return null;

  if (!session) {
    return (
      <Link
        href="/auth"
        className="px-5 h-9 bg-neutral-950 text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center border border-neutral-950 hover:bg-transparent hover:text-neutral-950 transition-all duration-200"
      >
        Sign In
      </Link>
    );
  }

  const dashboardHref = hasPermissions
    ? "/dashboard/team"
    : "/dashboard/clients";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full cursor-pointer"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={session.user.image || ""}
              alt={session.user.name || "User"}
            />
            <AvatarFallback>
              <UserRound className="h-5! w-5!" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="text-lg">
          {session.user.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-base">
          <Link className="w-full" href="/profile">
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-base">
          <Link className="w-full" href={dashboardHref}>
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            redirect("/");
          }}
          className="text-red-600 cursor-pointer text-base"
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthMenu;
