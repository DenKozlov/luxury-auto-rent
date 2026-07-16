"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InviteUserDialog from "./invite-user-dialog";
import { formSchema, InviteFormValues } from "@/schemas/invite-schema";
import { invitationsService } from "@/services/invitations.service";

const InviteUserContainer = () => {
  const [isInviting, setIsInviting] = useState(false);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { role: "user", email: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: InviteFormValues) => invitationsService.send(values),
    onSuccess: async () => {
      toast.success("User invitaion has been sent", { position: "top-right" });
    },
    onError: async () => {
      toast.error("User invitation flow failed. Please try again", {
        position: "top-right",
      });
    },
  });

  return (
    <InviteUserDialog
      mutate={mutate}
      isPending={isPending}
      control={control}
      reset={reset}
      handleSubmit={handleSubmit}
      isInviting={isInviting}
      setIsInviting={setIsInviting}
      errors={errors}
    />
  );
};

export default InviteUserContainer;
