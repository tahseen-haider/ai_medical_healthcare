"use client";

import { login } from "@/actions/auth.action";
import { signInWithOAuth } from "@/lib/oauth-client";
import FindUsHereSection from "@/components/FindUsHereSection";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Loading Screen */}
      {pending && <LoadingScreen message="Logging In..." />}

      {/* Login Section */}
      <section className="px-4 sm:px-6 py-8 flex items-center flex-col gap-8 max-w-[500px] w-full">
        {/* Header */}
        <div className="flex justify-between w-full gap-5 items-start">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to access your profile
            </p>
          </div>
          <div className="flex flex-col gap-3 items-end">
            <p className="text-sm text-muted-foreground">
              Don't have an account?
            </p>
            <Button
              variant="outline"
              onClick={() => redirect("/signup")}
              className="whitespace-nowrap bg-light-4 text-white dark:text-black dark:bg-white hover:dark:text-white"
            >
              Create Account
            </Button>
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full bg-white dark:bg-dark-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred sign in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OAuth Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => signInWithOAuth("google")}
                className="w-full"
                disabled={pending}
              >
                <Image
                  width={20}
                  height={20}
                  src="/icons/google-brands.svg"
                  alt="Google"
                  className="mr-2"
                />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => signInWithOAuth("github")}
                className="w-full"
                disabled={pending}
              >
                <Image
                  width={20}
                  height={20}
                  src="/icons/github-brands.svg"
                  alt="GitHub"
                  className="mr-2"
                />
                GitHub
              </Button>
            </div>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-dark-4 px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form action={action} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    required
                    disabled={pending}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    minLength={8}
                    disabled={pending}
                    className="pl-10"
                  />
                </div>
              </div>
              <Separator />
              {/* Error Messages */}
              {(state?.errors?.email ||
                state?.errors?.password ||
                state?.message) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {state?.errors?.email ||
                      state?.errors?.password ||
                      state?.message}
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <Button variant="link" asChild className="h-auto p-0">
                <Link href="/reset-password">Forgot your password?</Link>
              </Button>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <Button variant="link" asChild className="h-auto p-0">
                <Link href="/verify-email">Verify email address</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      <Separator />
      {/* Find Us Section */}
      <div className="w-full max-w-[1920px] mt-auto">
        <FindUsHereSection />
      </div>
    </main>
  );
}
