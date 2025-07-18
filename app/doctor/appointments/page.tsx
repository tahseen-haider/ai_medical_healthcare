import React from "react";
import YourAppointmentsPage from "@/components/YourAppointmentsPage";

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
        <YourAppointmentsPage paramPage={paramPage}/>
      </section>
    </main>
  );
}
