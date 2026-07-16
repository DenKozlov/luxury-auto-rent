import { createAuthClient, SuccessContext } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin } from "@/lib/actions/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3001",
  plugins: [
    adminClient({
      ac,
      roles: { admin },
    }),
  ],
});

const { useSession, getSession } = authClient;

const signUp = async (
  email: string,
  password: string,
  name: string,
  onSuccess:
    | ((context: SuccessContext<unknown>) => void | Promise<void>)
    | undefined,
) => {
  const result = await authClient.signUp.email(
    {
      name,
      email,
      password,
      callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/`,
    },
    {
      onSuccess,
    },
  );

  return result;
};

const signIn = async (email: string, password: string) => {
  const result = await authClient.signIn.email({
    email,
    password,
    callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/`,
  });

  return result;
};

const signInSocial = async (provider: "google" | "github") => {
  await authClient.signIn.social({
    provider,
    callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/`,
  });
};

const signOut = async () => {
  const result = await authClient.signOut();

  return result;
};

const getUser = async (id: string) => {
  return await authClient.admin.getUser({
    query: {
      id,
    },
  });
};

export {
  signIn,
  signUp,
  signOut,
  useSession,
  signInSocial,
  getSession,
  getUser,
};
