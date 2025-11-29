"use client";

import { verifyEmail } from "@/actions/auth.action";
import LoadingScreen from "@/components/LoadingScreen";
import { redirect } from "next/navigation";
import React, { useActionState } from "react";
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
import { AlertCircle, Mail, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function VerifyEmailTokenPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const resolvedParams = React.use(params);
  const decodedEmail = decodeURIComponent(resolvedParams.email);

  const [state, action, pending] = useActionState(verifyEmail, undefined);

  return (
    <main className="flex flex-col items-center min-h-[600px] bg-gray-50 dark:bg-gray-950">
      {pending && <LoadingScreen message="Verifying your email..." />}

      <section className="px-4 sm:px-6 py-8 flex items-center flex-col gap-8 max-w-[500px] w-full">
        {/* Header with Login Button */}
        <div className="flex justify-between w-full gap-5 items-start">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl text-foreground">
              Enter Verification Token
            </h1>
            <p className="text-muted-foreground">
              Enter the token sent to your email to complete verification
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

        {/* Form Card */}
        <Card className="w-full bg-white dark:bg-dark-4">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Verify Email</CardTitle>
            <CardDescription className="text-center">
              Please enter your token to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-6">
              {/* Email field (readonly) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    value={decodedEmail}
                    readOnly
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Token field */}
              <div className="space-y-2">
                <Label htmlFor="token" className="text-sm font-medium">
                  Verification Token
                </Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="token"
                    type="number"
                    name="token"
                    placeholder="6-digit code"
                    required
                    minLength={6}
                    maxLength={6}
                    disabled={pending}
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator />

              {/* Error Message */}
              {state?.message && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{state.message}</AlertDescription>
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
