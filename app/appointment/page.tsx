import React from "react";
import AppointmentPage from "./components/AppointmentPage";
import { getUserIdnRoleIfAuthenticatedAction } from "@/lib/dal/user.dal";
import { getAllDoctors } from "@/actions/admin.action";
import DoctorSection from "./components/DoctorsSection";

export default async function page() {
  const patient = await getUserIdnRoleIfAuthenticatedAction();
  const allDoctors = await getAllDoctors();
  return (
    <>
      <AppointmentPage
        patientId={patient?.userId}
        doctors={allDoctors}
      />
      <div className="w-full border-b-[1px] " />
      <DoctorSection />
    </>
  );
}
