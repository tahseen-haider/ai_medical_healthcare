"use client";
import React from "react";
import SendNewAppointmentMessage from "./Btns/SendNewMessageToPatient";
import { AppointmentWithRelations } from "@/lib/definitions";
import ChatAppointment from "@/components/ChatAppointment";

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

  const ReceivingData = {
    userId: appointment.doctorId ?? undefined,
    appointmentId: appointment.id,
  };

  return (
    <div className="flex gap-4">
      <ChatAppointment appData={ReceivingData}/>
      <SendNewAppointmentMessage data={data} />
    </div>
  );
}
