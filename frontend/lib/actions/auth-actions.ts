import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3001",
});

const { useSession, getSession } = authClient;

const signUp = async (email: string, password: string, name: string) => {
  const result = await authClient.signUp.email({
    name,
    email,
    password,
    callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/`,
  });

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

export { signIn, signUp, signOut, useSession, signInSocial, getSession };
