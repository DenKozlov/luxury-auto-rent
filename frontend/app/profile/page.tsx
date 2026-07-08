import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { getSession } from "@/lib/actions/auth-actions";
import { headers } from "next/headers";
import { User } from "better-auth";
import { redirect } from "next/navigation";
import { ProfileEditDialog } from "@/components/edit-profile-form";
import { DeactivateContainer } from "@/components/deactivate-container";

export default async function ProfilePage() {
  const session = await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data) {
    redirect("/");
  }
  const user = session.data.user as unknown as User;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto border border-zinc-800 p-10 bg-zinc-950/50">
        <h1 className="text-3xl font-serif mb-8">My Profile</h1>

        <div className="flex items-center gap-6">
          <Avatar style={{ width: 130, height: 130 }}>
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback>
              <UserRound className="w-16 h-16" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{user?.name}</h2>
            <p className="text-zinc-400">{user?.email}</p>
          </div>
        </div>
        <ProfileEditDialog user={user} />
        <DeactivateContainer id={user.id} />
      </div>
    </div>
  );
}
