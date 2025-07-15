import {
  getAllAppointmentsForDashboardDoctor,
} from "@/actions/doctor.action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

export default async function DoctorDashboardRecentAppointments({
  userId,
}: {
  userId: string;
}) {
  const appointments = await getAllAppointmentsForDashboardDoctor(userId);

  return (
    <Card className="w-full min-h-[calc(100vh-170px)] p-6 bg-white dark:bg-dark-4 flex flex-col justify-between shadow-md">
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Appointments</h2>
        </div>

        <div className="overflow-auto max-h-[500px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-dark-4 z-10">
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Patient Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Visit Reason</TableHead>
                <TableHead className="min-w-[100px]">Visit Time</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {appointments.map((appointment, index) => (
                <TableRow
                  key={appointment.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{appointment.fullname}</TableCell>
                  <TableCell>{appointment.email}</TableCell>
                  <TableCell>{appointment.phone || "N/A"}</TableCell>
                  <TableCell>{appointment.reasonForVisit}</TableCell>
                  <TableCell>{appointment.preferredTime}</TableCell>
                  <TableCell>
                    {appointment.preferredDate.toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell>{appointment.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
