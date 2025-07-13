
import React from "react";
import DoctorProfile from "./components/DocProfile";
import { redirect } from "next/navigation";
import { getDoctor } from "@/actions/doctor.action";

export default async function page({
  params,
}: {
  params: Promise<{ doctorId: string }>;
}) {
  const doctorId = (await params).doctorId;
  const doctor = await getDoctor(doctorId);

  if (!doctor) redirect("/");
  return <DoctorProfile user={doctor!} />;
}
