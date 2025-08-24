import { getPatientProfile } from "@/actions/doctor.action";
import { redirect } from "next/navigation";
import React from "react";
import PatientProfile from "./components/PatientProfile";
import { getUserIdnRoleIfAuthenticated } from "@/lib/dal/session.dal";

export default async function page({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const patientId = (await params).patientId;
  const patient = await getPatientProfile(patientId);
  if (!patient) redirect("/");
  const currentUser = await getUserIdnRoleIfAuthenticated();
  let currentDoctorId = undefined;

  if (currentUser?.role === "doctor") {
    currentDoctorId = currentUser.userId;
  }

  return (
    <div>
      <PatientProfile patient={patient} currentDoctorId={currentDoctorId} />
    </div>
  );
}
