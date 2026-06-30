"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputGroup } from "@/components/ui/input-group";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { signIn, signInSocial, signUp } from "@/lib/actions/auth-actions";
import Link from "next/link";

const baseFields = {
  email: z.email("Incorrect email format"),
  password: z
    .string()
    .min(8, "Password has to contain at least 8 symbols")
    .regex(/[A-Z]/, "Password has to contain at least one capital letter")
    .regex(/[0-9]/, "Password has to contain at least one number"),
};

const baseSchema = z.object(baseFields);

const signUpSchema = z.object({
  ...baseFields,
  name: z.string().min(6).max(50),
});

export type AuthFormValues = z.infer<typeof baseSchema> & { name?: string };

const AuthForm = () => {
  const [isSignIn, setIsSignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filtersSchema = isSignIn ? baseSchema : signUpSchema;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormValues>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
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

    try {
      if (isSignIn) {
        const result = await signIn(email, password);
        if (result.data && !result.data.user) {
          setError("Invalid email or password");
        }
      } else {
        const result = await signUp(email, password, name as string);
        if (result.data && !result.data.user) {
          setError("Failed to create account");
        }
      }
    } catch (error) {
      setError(
        `Authentication error: ${error instanceof Error ? error.message : "uknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
      <div className="w-full max-w-sm bg-white p-8 border border-gray-200 shadow-sm rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-1">
          {isSignIn ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-gray-500 text-center mb-6">
          {isSignIn
            ? "Sign in to your account to continue"
            : "Sign up to get started with Zenith"}
        </p>
        <div className="space-y-3">
          <Button
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  <FieldDescription className="text-red-500">
                    {errors.name?.message}
                  </FieldDescription>
                </Field>
              )}
            />
          )}
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
                <FieldDescription className="text-red-500">
                  {errors.email?.message}
                </FieldDescription>
              </Field>
            )}
          />
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
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye /> : <EyeOff />}
                  </Button>
                </InputGroup>
                <FieldDescription className="text-red-500">
                  {errors.password?.message}
                </FieldDescription>
              </Field>
            )}
          />

          <Button className="w-full gap-2 h-11 cursor-pointer py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold mt-2">
            {isLoading && <Spinner />}
            {isSignIn ? "Sign In" : "Sign up"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
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
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
