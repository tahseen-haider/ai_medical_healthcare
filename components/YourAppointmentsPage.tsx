// YourAppointmentsPage.tsx (Server Component)
import YourAppointmentsClient from "./YourAppointmentsClient";

export default async function YourAppointmentsPage({ paramPage }: { paramPage: string | undefined }) {
  const page = parseInt(paramPage || "1", 10);
  const limit = 6;

  return <YourAppointmentsClient page={page} limit={limit} />;
}
