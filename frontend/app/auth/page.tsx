"use client";

import AuthForm from "@/components/auth-form";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { invitationsService } from "@/services/invitations.service";

const SignInPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { data: validation, isFetching } = useQuery({
    queryKey: ["validation", token],
    queryFn: () => invitationsService.validate(token!),
    enabled: !!token,
  });

  if (!token) {
    return <AuthForm />;
  }

  if (isFetching) {
    return <div>Checking invitation...</div>;
  }

  if (!validation?.valid) {
    const reason = validation!.reason!;
    const messages: Record<string, string> = {
      not_found: "Invitation not found",
      already_accepted: "This invitation has already been used",
      revoked: "This invitation has been revoked",
      expired: "This invitation has expired",
    };
    return <div>{messages[reason] ?? "Invalid invitation"}</div>;
  }

  return <AuthForm token={token} invitationEmail={validation.email} />;
};

export default SignInPage;
