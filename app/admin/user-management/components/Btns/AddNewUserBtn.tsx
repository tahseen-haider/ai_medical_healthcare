"use client";

import { addNewUser } from "@/actions/admin.action";
import LoadingScreen from "@/components/LoadingScreen";
import PopUpCard from "@/components/PopUpCard";
import { UserPlus2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AddNewUserBtn() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [state, action, pending] = useActionState(addNewUser, undefined);

  useEffect(() => {
    if (state?.success) {
      setShowPopUp(false);
    }
  }, [state]);

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => setShowPopUp(true)}
        className="p-2 bg-light-4 dark:bg-white text-white dark:text-black"
      >
        <UserPlus2 className="w-5 h-5" />
      </Button>

      {pending && <LoadingScreen message="Adding New User..." />}

      {showPopUp && (
        <PopUpCard setState={setShowPopUp}>
          <Card className="w-[320px] sm:w-[500px] bg-white dark:bg-dark-4">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Add User</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={action} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Full Name</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Dr. John Doe"
                        required
                        disabled={pending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@mail.com"
                        required
                        disabled={pending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="********"
                        required
                        minLength={8}
                        maxLength={15}
                        disabled={pending}
                      />
                    </div>
                  </div>
                </div>

                {state?.message && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{state.message}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={pending}>
                  {pending ? "Adding..." : "Add User"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </PopUpCard>
      )}
    </div>
  );
}
