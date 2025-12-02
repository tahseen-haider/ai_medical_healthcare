"use client";

import { verifyEmail } from "@/actions/auth.action";
import LoadingScreen from "@/components/LoadingScreen";
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
import Link from "next/link";

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
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
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
                <div className="relative flex items-center">
                  <ShieldCheck className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="token"
                    type="text"
                    name="token"
                    placeholder="6-digit code"
                    required
                    pattern="\d{6}"
                    maxLength={6}
                    inputMode="numeric"
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
