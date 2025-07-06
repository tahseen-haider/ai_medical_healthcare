import React from "react";
import AppointmentsList from "./components/AppointmentsList";

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
        {/* Heading */}
        <h1 className="font-bold font-ubuntu text-2xl ml-9">Appointments</h1>
        {/* Doctors Pagination List */}
        <AppointmentsList paramPage={paramPage} />
      </section>
    </main>
  );
}
