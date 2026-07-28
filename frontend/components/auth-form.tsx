"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputGroup } from "@/components/ui/input-group";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { signIn, signInSocial, signUp } from "@/lib/actions/auth-actions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { invitationsService } from "@/services/invitations.service";

const baseFields = {
  password: z
    .string()
    .min(8, "Password has to contain at least 8 symbols")
    .regex(/[A-Z]/, "Password has to contain at least one capital letter")
    .regex(/[0-9]/, "Password has to contain at least one number"),
};

const signInSchema = z.object({
  ...baseFields,
  email: z.email("Incorrect email format"),
});

const signUpSchema = z.object({
  ...baseFields,
  name: z.string().min(6).max(50),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

// Создаем тип, который точно знает, какие поля нужны в зависимости от режима
export type AuthFormValues = (SignInValues | SignUpValues) & {
  email?: string;
  name?: string;
};

const AuthForm = ({
  token,
  invitationEmail,
}: {
  token?: string;
  invitationEmail?: string;
}) => {
  const router = useRouter();
  const isSignIn = !token;
  // const [isSignIn, setIsSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filtersSchema = isSignIn ? signInSchema : signUpSchema;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormValues>({
    defaultValues: {
      password: "",
      name: "",
      email: "",
    },
    resolver: zodResolver(filtersSchema),
  });

  const handleSocialAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError(null);

    try {
      await signInSocial(provider);
    } catch (error) {
      setError(
        `Error authenticating with ${provider}: ${error instanceof Error ? error.message : "uknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: AuthFormValues) => {
    const { email, password, name } = values;
    setIsLoading(true);
    setError(null);

    if (isSignIn) {
      const { error } = await signIn(email!, password);
      if (error) {
        setError(error.message || "An error occurred while authenticating");
        setIsLoading(false);
      }
      return;
    }

    try {
      await invitationsService.accept({ token: token!, name: name!, password });
      router.refresh();
      router.push("/");
    } catch (e) {
      const error = e as Error;
      setError(
        error.message || "Failed to create account. Please try again later.",
      );
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white p-8 border border-gray-200 shadow-sm rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-1">
          {isSignIn ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-gray-500 text-center mb-6">
          {isSignIn
            ? "Sign in to your account to continue"
            : "Sign up to get started with Zenith"}
        </p>
        {!isSignIn && (
          <p className="mb-4 text-center">
            Creating an account for <strong>{invitationEmail}</strong>
          </p>
        )}
        {/* <div className="space-y-3">
          <Button
            data-testid="google-button"
            onClick={() => handleSocialAuth("google")}
            variant="outline"
            className="w-full cursor-pointer h-11 flex items-center justify-center gap-3 rounded-lg border-gray-200 hover:bg-gray-50 transition-all duration-200"
          >
            <Image width={20} height={20} src="/google.svg" alt="Google" />
            <span className="font-medium text-gray-700">
              Continue with Google
            </span>
          </Button>
          <Button
            data-testid="github-button"
            onClick={() => handleSocialAuth("github")}
            className="w-full cursor-pointer h-11 flex items-center justify-center gap-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-200"
          >
            <Image
              width={20}
              height={20}
              src="/github.svg"
              alt="GitHub"
              className="invert"
            />
            <span className="font-medium text-white">Continue with GitHub</span>
          </Button>
        </div> 

        <div className="relative my-7">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          onChange={() => {
            if (error) setError(null);
          }}
          className="space-y-4"
        >
          {!isSignIn && (
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    autoComplete="off"
                    placeholder="Enter your full name"
                    aria-invalid={!!errors.name}
                  />
                  <FieldError errors={[{ message: errors.name?.message }]} />
                </Field>
              )}
            />
          )}
          {isSignIn && (
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    autoComplete="off"
                    type="email"
                    placeholder="Enter your email"
                    aria-invalid={!!errors.email}
                  />
                  <FieldError errors={[{ message: errors.email?.message }]} />
                </Field>
              )}
            />
          )}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <InputGroup className="transition-all focus-within:ring-ring/50 focus-within:ring-3 focus-within:border-ring aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20">
                  <Input
                    {...field}
                    id="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 aria-invalid:ring-0 aria-invalid:ring-offset-0"
                    aria-invalid={!!errors.password}
                  />
                  <Button
                    data-testid="show-password-button"
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </Button>
                </InputGroup>
                <FieldError errors={[{ message: errors.password?.message }]} />
              </Field>
            )}
          />
          <div className="text-red-500 mb-0 text-sm">{error}</div>
          <Button className="w-full gap-2 h-11 cursor-pointer py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold mt-2">
            {isLoading && <Spinner />}
            {isSignIn ? "Sign In" : "Sign up"}
          </Button>
        </form>

        {/* <p className="text-center text-sm text-gray-500 mt-6">
          {isSignIn ? "Don’t have an account?" : "Already have an account?"}
          <Button
            variant="link"
            className="h-auto ml-1 p-0 font-semibold text-primary cursor-pointer"
            onClick={() => {
              setIsSignIn(!isSignIn);
              reset();
            }}
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </Button>
        </p> */}
      </div>
    </div>
  );
};

export default AuthForm;
