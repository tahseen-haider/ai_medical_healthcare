"use client";

import { addNewDoctor } from "@/actions/admin.action";
import { useActionState, useEffect, useState } from "react";
import PopUpCard from "@/components/PopUpCard";
import LoadingScreen from "@/components/LoadingScreen";
import SelectDoctorType from "./SelectDoctorType";
import { UserPlus2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AddNewDoctorBtn() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [state, action, pending] = useActionState(addNewDoctor, undefined);

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

      {pending && <LoadingScreen message="Adding New Doctor..." />}

      {showPopUp && (
        <PopUpCard setState={setShowPopUp}>
          <Card className="w-[320px] sm:w-[500px] bg-white dark:bg-dark-4">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Add Doctor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={action} className="space-y-6">
                <div className="space-y-4">
                  {/* Doctor Name */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Doctor Name</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Dr. John Doe"
                      required
                      disabled={pending}
                    />
                  </div>

                  {/* Email */}
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

                  {/* Password */}
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

                  {/* Doctor Type */}
                  <div className="space-y-2">
                    <Label htmlFor="docType">Doctor Type</Label>
                    <SelectDoctorType setDocType={setSelectedDocType} />
                    <input
                      type="hidden"
                      name="docType"
                      value={selectedDocType}
                      readOnly
                    />
                  </div>
                </div>

                {/* Error Message */}
                {state?.message && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{state.message}</AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full text-base"
                  disabled={pending}
                >
                  {pending ? "Adding..." : "Add Doctor"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </PopUpCard>
      )}
    </div>
  );
}
