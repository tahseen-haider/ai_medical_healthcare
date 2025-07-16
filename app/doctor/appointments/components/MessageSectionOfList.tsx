import React from "react";
import AppointmentMessages from "./AppointmentMessages";
import { AppointmentWithRelations } from "@/lib/definitions";

export default function MessageSectionOfList({
  appointment,
}: {
  appointment: AppointmentWithRelations;
}) {
  return <AppointmentMessages appointment={appointment} />;
}
