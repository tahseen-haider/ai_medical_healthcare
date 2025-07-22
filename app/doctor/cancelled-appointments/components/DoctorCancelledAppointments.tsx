import { getCancelledAppointmentsForDoctor } from "@/actions/doctor.action";
import { getUserIdnRoleIfAuthenticated } from "@/lib/session";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EditAppointmentStatus from "../../components/EditAppointmentStatus";

export default async function DoctorCancelledAppointmentsList({
  paramPage,
}: {
  paramPage?: string;
}) {
  const page = parseInt(paramPage || "1", 10);
  const limit = 10;

  const user = await getUserIdnRoleIfAuthenticated();
  const id = user?.userId;
  const { appointments, totalPages } = await getCancelledAppointmentsForDoctor(
    page,
    limit,
    id!
  );

  return (
    <Card className="w-full min-h-[calc(100vh-120px)] p-6 bg-white dark:bg-dark-4 flex flex-col justify-between shadow-md">
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Outdated Appointments</h2>
        </div>

        <div className="overflow-auto">
          {appointments?.length! < 1 ? (
            <p className="text-center text-gray-500">No appointments</p>
          ) : (
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
                {appointments?.map((appointment, index) => (
                  <TableRow
                    key={appointment.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell>{appointment.fullname}</TableCell>
                    <TableCell>{appointment.email}</TableCell>
                    <TableCell>{appointment.phone || "N/A"}</TableCell>
                    <TableCell>{appointment.reasonForVisit}</TableCell>
                    <TableCell>{appointment.preferredTime}</TableCell>
                    <TableCell>
                      {appointment.preferredDate.toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>
                      <EditAppointmentStatus
                        currentPage={page}
                        appointmentId={appointment.id}
                        currentStatus={appointment.status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-4 mt-6">
        {page > 1 && (
          <Button variant="outline" size="sm" asChild>
            <a href={`?page=${page - 1}`}>Previous</a>
          </Button>
        )}
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        {page < totalPages && (
          <Button variant="outline" size="sm" asChild>
            <a href={`?page=${page + 1}`}>Next</a>
          </Button>
        )}
      </div>
    </Card>
  );
}
