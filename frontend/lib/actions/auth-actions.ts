import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3001",
});

const signUp = async (email: string, password: string, name: string) => {
  const result = await authClient.signUp.email({
    name,
    email,
    password,
  });

  return result;
};

const signIn = async (email: string, password: string) => {
  const result = await authClient.signIn.email({
    email,
    password,
  });

  return result;
};

const signOut = async () => {
  const result = await authClient.signOut();

  return result;
};

export { signIn, signUp, signOut };
