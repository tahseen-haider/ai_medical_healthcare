"use client";
import { Mail } from "lucide-react";
import React from "react";
import SendNewAppointmentMessage from "./Btns/SendNewMessageToPatient";
import { AppointmentWithRelations } from "@/lib/definitions";

export default function AppointmentMessages({
  appointment,
}: {
  appointment: AppointmentWithRelations;
}) {
  const data = {
    senderId: appointment.doctor?.id,
    receiverId: appointment.patient?.id,
    appointmentId: appointment.id,
  };
  return (
    <div className="flex gap-4">
      <Mail />
      <SendNewAppointmentMessage data={data} />
    </div>
  );
}
