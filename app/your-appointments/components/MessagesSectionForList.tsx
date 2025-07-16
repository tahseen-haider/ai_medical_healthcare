"use client";
import React from "react";
import SendNewAppointmentMessage from "@/app/doctor/appointments/components/Btns/SendNewMessageToPatient";
import { $Enums } from "@prisma/client";
import ChatAppointment from "./ChatAppointment";

export default function MessagesSectionForList({
  appointment,
}: {
  appointment: {
    id: string;
    updatedAt: Date;
    email: string;
    phone: string | null;
    createdAt: Date;
    fullname: string;
    reasonForVisit: string;
    preferredDate: Date;
    preferredTime: string;
    status: $Enums.AppointmentStatus;
    doctorId: string | null;
    patientId: string | null;
  };
}) {
  const data = {
    senderId: appointment.patientId ?? undefined,
    receiverId: appointment.doctorId ?? undefined,
    appointmentId: appointment.id,
  };
  return (
    <div className="flex gap-4">
      <ChatAppointment appData={data}/>
      <SendNewAppointmentMessage data={data} />
    </div>
  );
}
