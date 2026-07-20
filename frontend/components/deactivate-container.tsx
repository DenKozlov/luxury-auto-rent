"use client";

import { useMutation } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import DeactivateDialog from "./deactivate-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "@/lib/actions/auth-actions";

export function DeactivateContainer() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: () => usersService.deactivateMe(),
    onSuccess: async () => {
      await signOut();
      router.push("/");
      toast.success("Account has been deactivated.", { position: "top-right" });
    },
  });

  return <DeactivateDialog onDeactivate={mutate} isPending={isPending} />;
}
