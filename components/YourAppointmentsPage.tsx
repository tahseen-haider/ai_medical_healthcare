import { getAuthUserWithAppointmentsAndUnreadReceivedMessages } from "@/actions";
import { AppointmentStatus, UserRole } from "@prisma/client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";
import MessagesSectionForList from "@/app/your-appointments/components/MessagesSectionForList";

export default async function YourAppointmentsPage({
  paramPage,
}: {
  paramPage: string | undefined;
}) {
  const page = parseInt(paramPage || "1", 10);
  const limit = 6;

  const user = await getAuthUserWithAppointmentsAndUnreadReceivedMessages(
    page,
    limit
  );

  const appointments = (
    (user?.role === "user"
      ? user?.appointmentsAsPatient
      : user?.role === "doctor"
      ? user?.appointmentsAsDoctor
      : []) || []
  ).map((appointment) => {
    const timeParts = appointment.preferredTime.match(/(\d+):(\d+)\s?(AM|PM)/i);
    const dateTime = new Date(appointment.preferredDate); // Clone the Date object

    if (timeParts) {
      let [, hourStr, minuteStr, meridiem] = timeParts;
      let hours = parseInt(hourStr, 10);
      const minutes = parseInt(minuteStr, 10);

      // Convert to 24-hour format
      if (meridiem.toUpperCase() === "PM" && hours < 12) {
        hours += 12;
      } else if (meridiem.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }

      dateTime.setHours(hours, minutes, 0, 0);
    }

    const isFuture = dateTime > new Date();

    if (!isFuture) {
      return { ...appointment, status: "Outdated" };
    }
    return appointment;
  });

  const getStatusVariant = (status: string) => {
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
      case "Outdated":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="bg-gray-50 dark:bg-dark-4 min-h-[calc(100vh-160px)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <p className="text-muted-foreground text-lg">
              No appointments found.
            </p>
            {user?.role === "user" && (
              <Link
                href="/appointment"
                className="inline-flex items-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors"
              >
                Book an Appointment
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {user?.role === UserRole.user ? "Patient" : "Doctor"} Name
                  </TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Messages</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments?.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell
                      className={`${
                        appointment.status === "Outdated" ? "line-through" : ""
                      }`}
                    >
                      {appointment.fullname}
                    </TableCell>
                    <TableCell
                      className={`${
                        appointment.status === "Outdated" ? "line-through" : ""
                      }`}
                    >
                      {appointment.reasonForVisit}
                    </TableCell>
                    <TableCell
                      className={`${
                        appointment.status === "Outdated" ? "line-through" : ""
                      }`}
                    >
                      {appointment.preferredTime}
                    </TableCell>
                    <TableCell
                      className={`${
                        appointment.status === "Outdated" ? "line-through" : ""
                      }`}
                    >
                      {appointment.preferredDate.toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <MessagesSectionForList userRole={user?.role} appointment={appointment} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {/* Pagination */}
        <div className="flex justify-end items-center gap-3 mt-4">
          {page > 1 && (
            <a
              href={`?page=${page - 1}`}
              className="px-3 py-1 border rounded-md text-sm"
            >
              Previous
            </a>
          )}
          <span className="text-sm">
            Page {page} of {user?.totalPages}
          </span>
          {page < (user?.totalPages || 0) && (
            <a
              href={`?page=${page + 1}`}
              className="px-3 py-1 border rounded-md text-sm"
            >
              Next
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
