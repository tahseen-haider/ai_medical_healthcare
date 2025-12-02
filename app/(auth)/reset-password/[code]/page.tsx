"use client";

import { resetPassword } from "@/actions/auth.action";
import LoadingScreen from "@/components/LoadingScreen";
import { redirect } from "next/navigation";
import { useActionState, useState } from "react";
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
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React from "react";
import Link from "next/link";

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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  return (
    <main className="flex flex-col items-center min-h-[600px] bg-gray-50 dark:bg-gray-950">
      {/* Loading Screen */}
      {pending && <LoadingScreen message="Resetting your Password..." />}

      <section className="px-4 sm:px-6 py-8 flex items-center flex-col gap-8 max-w-[500px] w-full">
        {/* Reset Password Card */}
        <Card className="w-full bg-white dark:bg-dark-4">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Set New Password
            </CardTitle>
            <CardDescription className="text-center">
              Choose a strong password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-6">
              {/* Hidden Inputs for Email and Code */}
              <input type="hidden" name="email" value={email} readOnly />
              <input type="hidden" name="code" value={code} readOnly />

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="********"
                    required
                    minLength={6}
                    disabled={pending}
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Repeat New Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="repeatNewPassword"
                  className="text-sm font-medium"
                >
                  Repeat New Password
                </Label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="repeatNewPassword"
                    name="repeatNewPassword"
                    type={showRepeatPassword ? "text" : "password"}
                    placeholder="********"
                    required
                    minLength={6}
                    disabled={pending}
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                  >
                    {showRepeatPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
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

            {/* Link */}
            <div className="mt-4 flex justify-center gap-2 w-full">
              <p className="text-sm text-muted-foreground">Back to Login?</p>
              <Button variant="link" asChild className="h-auto p-0">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
