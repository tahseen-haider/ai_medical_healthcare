"use client";

import { SendForgotPasswordLinkToEmail } from "@/actions/auth.action";
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
import { AlertCircle, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(
    SendForgotPasswordLinkToEmail,
    undefined
  );

  return (
    <main className="flex flex-col items-center min-h-[600px] bg-gray-50 dark:bg-gray-950">
      {/* Loading Screen */}
      {pending && <LoadingScreen message="Sending verification email" />}

      <section className="px-4 sm:px-6 py-8 flex items-center flex-col gap-8 max-w-[500px] w-full">
        {/* Header */}
        <div className="flex justify-between w-full gap-5 items-start">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl text-foreground">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email to send a verification link
            </p>
          </div>
          <div className="flex flex-col gap-3 items-end">
            <p className="text-sm text-muted-foreground">
              Back to login page?
            </p>
            <Button
              variant="outline"
              onClick={() => redirect("/login")}
              className="whitespace-nowrap bg-light-4 text-white dark:text-black dark:bg-white"
            >
              Log In
            </Button>
          </div>
        </div>

        {/* Form Card */}
        <Card className="w-full bg-white dark:bg-dark-4">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              We’ll send you a reset link
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

              <Separator />

              {/* Error Message */}
              {state?.message && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{state.message}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
