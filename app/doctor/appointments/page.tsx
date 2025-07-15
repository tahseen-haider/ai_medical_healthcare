import React from "react";
import DoctorAppointmentsList from "./components/DoctorAppointmentsList";

export default async function page({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const paramPage = params?.page;
  return (
    <main className="w-full flex justify-center">
      <section className="flex flex-col gap-4 p-6 w-full max-w-[1920px]">
        {/* Doctors Pagination List */}
        <DoctorAppointmentsList paramPage={paramPage} />
      </section>
    </main>
  );
}
