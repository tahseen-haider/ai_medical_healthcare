// YourAppointmentsPage.tsx (Server Component)
import YourAppointmentsClient from "./YourAppointmentsClient";

export default async function YourAppointmentsPage({
  paramPage,
  userRole,
}: {
  paramPage: string | undefined;
  userRole?: string;
}) {
  const page = parseInt(paramPage || "1", 10);
  const limit = 6;

  return <YourAppointmentsClient userRole={userRole} page={page} limit={limit} />;
}
