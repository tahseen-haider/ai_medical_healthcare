"use client";

import { sendVerifyEmail } from "@/actions/auth.action";
import LoadingScreen from "@/components/LoadingScreen";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Mail, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function VerifyEmailPage() {
  const [state, action, pending] = useActionState(sendVerifyEmail, undefined);

  return (
    <main className="flex flex-col items-center min-h-[600px] bg-gray-50 dark:bg-gray-950">
      {/* Loading Screen */}
      {pending && <LoadingScreen message="Sending verification email" />}

      <section className="px-4 sm:px-6 py-8 flex items-center flex-col gap-8 max-w-[500px] w-full">
        {/* Header with Login Button */}
        <div className="flex justify-between w-full gap-5 items-start">
          <div className="flex flex-col gap-2 max-w-8/12">
            <h1 className="font-bold text-4xl text-foreground">
              Email Verification
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your email and password to verify your email address
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <p className="text-sm text-muted-foreground">Already verified?</p>
            <Button
              variant="outline"
              onClick={() => redirect("/login")}
              className="whitespace-nowrap bg-light-4 text-white dark:text-black dark:bg-white hover:dark:text-white"
            >
              Log In
            </Button>
          </div>
        </div>

        {/* Card */}
        <Card className="w-full bg-white dark:bg-dark-4">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Verify Email</CardTitle>
            <CardDescription className="text-center">
              This will confirm your email address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-6">
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
                    placeholder="********"
                    required
                    minLength={6}
                    disabled={pending}
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator />

              {/* Error messages */}
              {(state?.errors?.password || state?.message) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {state?.errors?.password || state?.message}
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
