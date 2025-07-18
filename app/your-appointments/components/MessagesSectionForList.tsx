"use client";
import React from "react";
import SendNewAppointmentMessage from "@/app/doctor/appointments/components/Btns/SendNewMessageToPatient";
import ChatAppointment from "@/components/ChatAppointment";
import { AppointmentWithUnreadFlag } from "@/lib/dal";
import { UserRole } from "@prisma/client";

export default function MessagesSectionForList({
  appointment,
  userRole,
}: {
  userRole: UserRole | undefined;
  appointment: AppointmentWithUnreadFlag;
}) {
  const isUser = userRole === "user";

  const SendingData = {
    senderId: isUser
      ? appointment.patientId ?? undefined
      : appointment.doctorId ?? undefined,
    receiverId: isUser
      ? appointment.doctorId ?? undefined
      : appointment.patientId ?? undefined,
    appointmentId: appointment.id,
  };

  const ReceivingData = {
    userId: isUser
      ? appointment.patientId ?? undefined
      : appointment.doctorId ?? undefined,
    appointmentId: appointment.id,
    hasUnread: appointment.hasUnreadReceivedMessages,
  };

  return (
    <div className="flex gap-4">
      <ChatAppointment appData={ReceivingData} />
      <SendNewAppointmentMessage data={SendingData} />
    </div>
  );
}
