"use client";

import { resetPassword } from "@/actions/auth.action";
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
import { AlertCircle, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ code: number }>;
}) {
  const resolvedParams = React.use(params);
  const emailnCode = resolvedParams.code;
  const emailEncoded = emailnCode.toString().split("-")[0];
  const code = emailnCode.toString().split("-")[1];
  const email = decodeURIComponent(emailEncoded);

  const [state, action, pending] = useActionState(resetPassword, undefined);

  return (
    <main className="flex flex-col items-center min-h-[600px] bg-background">
      {/* Loading Screen */}
      {pending && <LoadingScreen message="Resetting your Password..." />}

      <section className="px-4 sm:px-6 py-8 flex items-center flex-col gap-8 max-w-[500px] w-full">
        {/* Header */}
        <div className="flex justify-between w-full gap-5 items-start">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl text-foreground">Reset Password</h1>
            <p className="text-muted-foreground text-sm">
              Enter your new password to reset your account
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <p className="text-sm text-muted-foreground">Password not resetting?</p>
            <Button
              variant="outline"
              onClick={() => redirect("/reset-password")}
              className="whitespace-nowrap bg-light-4 text-white dark:text-black dark:bg-white"
            >
              Send Link Again
            </Button>
          </div>
        </div>

        {/* Reset Password Card */}
        <Card className="w-full bg-white dark:bg-dark-4">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Set New Password</CardTitle>
            <CardDescription className="text-center">
              Choose a strong password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-6">
              {/* Hidden Inputs for Email and Code */}
              <input type="hidden" name="email" value={email} readOnly />
              <input type="hidden" name="code" value={code} readOnly />

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="********"
                    required
                    minLength={6}
                    disabled={pending}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repeatNewPassword" className="text-sm font-medium">
                  Repeat New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="repeatNewPassword"
                    name="repeatNewPassword"
                    type="password"
                    placeholder="********"
                    required
                    minLength={6}
                    disabled={pending}
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator />

              {/* Error message */}
              {state?.message && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
