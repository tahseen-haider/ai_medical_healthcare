"use client";

import { sendVerifyEmail } from "@/actions/auth.action";
import LoadingScreen from "@/components/LoadingScreen";
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
import { AlertCircle, Mail, Lock, EyeOff, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [state, action, pending] = useActionState(sendVerifyEmail, undefined);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex flex-col items-center min-h-[600px] bg-gray-50 dark:bg-gray-950">
      {/* Loading Screen */}
      {pending && <LoadingScreen message="Sending verification email" />}

      <section className="px-4 sm:px-6 py-8 flex items-center flex-col gap-8 max-w-[500px] w-full">
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
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
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

                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    required
                    minLength={8}
                    disabled={pending}
                    className="pl-10 pr-10"
                  />

                  <Button
                    type="button"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent hover:bg-black/10"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
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
