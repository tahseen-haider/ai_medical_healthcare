import React from "react";
import YourAppointmentsPage from "@/components/YourAppointmentsPage";
import { getUserIdnRoleIfAuthenticated } from "@/lib/session";

export default async function page({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const user = await getUserIdnRoleIfAuthenticated();
  const paramPage = params?.page;
  return (
    <main className="w-full flex justify-center">
      <section className="flex flex-col gap-4 p-6 w-full max-w-[1920px]">
        {/* Doctors Pagination List */}
        <YourAppointmentsPage userRole={user?.role} paramPage={paramPage} />
      </section>
    </main>
  );
}
