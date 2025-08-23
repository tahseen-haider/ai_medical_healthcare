import YourAppointmentsPage from "@/components/YourAppointmentsPage";
import { getUserIdnRoleIfAuthenticated } from "@/lib/dal/session.dal";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const param = await searchParams;
  const user = await getUserIdnRoleIfAuthenticated();
  const paramPage = param?.page;
  return (
    <main className="w-full flex justify-center">
      <section className="flex flex-col gap-4 p-6 w-full max-w-[1920px]">
        <YourAppointmentsPage userRole={user?.role} paramPage={paramPage}/>
      </section>
    </main>
  );
}
