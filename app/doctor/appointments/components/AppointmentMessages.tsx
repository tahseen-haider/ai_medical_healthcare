"use client";
import { DoctorAppointment } from "@/lib/definitions";
import { Mail } from "lucide-react";
import React from "react";
import SendNewAppointmentMessage from "./Btns/SendNewMessageToPatient";

export default function AppointmentMessages({
  user,
}: {
  user: { id: string; name: string; } | null;
}) {
  return (
    <div className="flex gap-4">
      <Mail />
      <SendNewAppointmentMessage userId={user!.id}/>
    </div>
  );
}
