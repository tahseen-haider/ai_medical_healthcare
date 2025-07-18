"use client";

import { setAppointmentIsPaidTrue } from "@/actions";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.metadata?.appointmentId) {
            setAppointmentId(data.metadata.appointmentId);
          }
        });
    }
  }, [sessionId]);

  useEffect(() => {
    if (appointmentId) {
      (async () => {
        await setAppointmentIsPaidTrue(appointmentId);
        router.push("/your-appointments"); // ✅ safe client-side redirect
      })();
    }
  }, [appointmentId, router]);

  if (!appointmentId)
    return <LoadingScreen message="Processing your payments..." />;

  return <LoadingScreen message="Redirecting you to your appointments..." />;
}
