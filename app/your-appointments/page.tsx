import { AppointmentStatus, PrismaClient, UserRole } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthUserWithAppointments } from "@/actions";
import Link from "next/link";

export default async function AppointmentsPage() {
  const user = await getAuthUserWithAppointments();

  const allAppointments = [
    ...(user?.appointmentsAsPatient || []),
    ...(user?.appointmentsAsDoctor || []),
  ].sort(
    (a, b) =>
      new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime()
  ); // Sort by date

  const getStatusVariant = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return "default";
      case AppointmentStatus.PENDING:
      case AppointmentStatus.PAYMENT_PENDING:
        return "secondary";
      case AppointmentStatus.CANCELLED:
        return "destructive";
      case AppointmentStatus.COMPLETED:
      case AppointmentStatus.RESCHEDULED:
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <main className="max-w-[1500px] mx-auto px-4 py-8">
      <Card className="bg-gray-50 dark:bg-dark-4 min-h-[calc(100vh-160px)]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Your Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <p className="text-muted-foreground text-lg">
                No appointments found.
              </p>
              <Link
                href="/appointment"
                className="inline-flex items-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors"
              >
                Book an Appointment
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>
                      {user?.role === UserRole.user ? "Patient" : "Doctor"}
                    </TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {appointment.preferredDate}
                      </TableCell>
                      <TableCell>{appointment.preferredTime}</TableCell>
                      <TableCell>{appointment.fullname}</TableCell>
                      <TableCell>{appointment.reasonForVisit}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(appointment.status)}>
                          {appointment.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
