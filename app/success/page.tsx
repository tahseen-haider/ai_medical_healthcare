"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/components/LoadingScreen";
import { setAppointmentIsPaidTrue } from "@/actions";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/stripe/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          const id = data?.metadata?.appointmentId ?? null;
          setAppointmentId(id);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching session:", err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (appointmentId) {
      (async () => {
        await setAppointmentIsPaidTrue(appointmentId);
        setIsProcessed(true);
      })();
    }
  }, [appointmentId]);

  // Show loading screen while fetching appointment ID or processing
  if (isLoading || (appointmentId && !isProcessed)) {
    return <LoadingScreen message="Processing your payment..." />;
  }

  // If no appointmentId found (edge case)
  if (!appointmentId && !isLoading) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <Card className="w-full max-w-md text-center bg-white dark:bg-dark-4">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">
              Something went wrong
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              We couldn’t verify your payment. Please try again or contact
              support.
            </p>
            <Button asChild className="w-full">
              <a href="/your-appointments">Back to Appointments</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success message
  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-md text-center bg-white dark:bg-dark-4">
        <CardHeader>
          <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
          <CardTitle className="text-2xl">Payment Successful</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Your payment was successfully processed. Redirecting shortly...
          </p>
          <Button asChild className="w-full">
            <a href="/your-appointments">Go to Appointments</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
