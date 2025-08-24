"use client";

import { getAuthUserWithAppointmentsAndUnreadReceivedMessages } from "@/actions";
import { AppointmentStatus, UserRole } from "@prisma/client";
import React, { useEffect, useState } from "react";
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
import MessagesSectionForList from "@/components/MessagesSectionForList";
import EditAppointmentStatus from "@/app/doctor/components/EditAppointmentStatus";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import CheckoutButton from "./CheckoutButton";
import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { AuthUserWithAppointmentsAndMessages } from "@/lib/dal/index.dal";
import YourAppointmentsSkeleton from "./YourAppointmentsSkeleton";
import DeleteAppointmentBtn from "@/app/admin/appointments/components/Btns/DeleteAppointmentBtn";
import ProfilePicture from "./ProfilePicture";

export default function YourAppointmentsClient({
  page,
  limit,
  userRole,
}: {
  userRole?: string;
  page: number;
  limit: number;
}) {
  const [user, setUserData] =
    useState<AuthUserWithAppointmentsAndMessages | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    const data = await getAuthUserWithAppointmentsAndUnreadReceivedMessages(
      page,
      limit
    );
    setUserData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [page]);

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

    if (
      !isFuture &&
      appointment.status !== AppointmentStatus.PAID &&
      appointment.status !== AppointmentStatus.COMPLETED &&
      appointment.status !== AppointmentStatus.CONFIRMED
    ) {
      return { ...appointment, status: "OUTDATED" };
    }
    return appointment;
  });

  if (loading || !user) {
    return <YourAppointmentsSkeleton />;
  }

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
      case "OUTDATED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const appointmentBadge = (
    status: string,
    paymentData: {
      doctorName: string | undefined;
      fee: number | undefined;
      appointmentId: string | undefined;
    }
  ) => {
    if (
      status === "PAYMENT_PENDING" &&
      paymentData.doctorName &&
      paymentData.fee
    )
      return (
        <HoverCard openDelay={100}>
          <HoverCardTrigger>
            <Badge variant={getStatusVariant(status)}>{status}</Badge>
          </HoverCardTrigger>
          <HoverCardContent className="flex justify-center items-center w-fit">
            <CheckoutButton
              items={[
                {
                  name: `Appointment payment to ${paymentData.doctorName}`,
                  unit_amount: paymentData.fee,
                  quantity: 1,
                },
              ]}
              appointmentId={paymentData.appointmentId}
            />
          </HoverCardContent>
        </HoverCard>
      );
    return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
  };

  function setPaymentStatus(
    status: string,
    is_paid: boolean | null | undefined,
    paymentData: {
      doctorName: string | undefined;
      fee: number | undefined;
      appointmentId: string | undefined;
    }
  ): React.ReactNode {
    const commonBadgeClass = "text-xs";

    if (status === AppointmentStatus.COMPLETED) {
      return (
        <Badge variant="outline" className={commonBadgeClass}>
          Completed
        </Badge>
      );
    }

    if (is_paid) {
      return (
        <Badge variant="default" className={commonBadgeClass}>
          Paid
        </Badge>
      );
    }

    if (!is_paid && status === AppointmentStatus.PENDING) {
      return (
        <Badge variant="default" className={commonBadgeClass}>
          Pending Confirmation
        </Badge>
      );
    }

    if (
      !is_paid &&
      status === AppointmentStatus.PAYMENT_PENDING &&
      userRole === "user"
    ) {
      return (
        <CheckoutButton
          items={[
            {
              name: `Appointment payment to ${paymentData.doctorName}`,
              unit_amount: paymentData.fee,
              quantity: 1,
            },
          ]}
          appointmentId={paymentData.appointmentId}
        />
      );
    }

    return (
      <Badge variant="destructive" className={commonBadgeClass}>
        Unpaid
      </Badge>
    );
  }

  return (
    <Card className="bg-gray-50 dark:bg-dark-4 min-h-[calc(100vh-160px)]">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold">Your Appointments</CardTitle>
        <Button
          onClick={fetchAppointments}
          variant="default"
          disabled={loading}
        >
          <RefreshCw size={40} className={loading ? "animate-spin" : ""} />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1">
        {appointments?.length === 0 || !userRole ? (
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
                  <TableHead>Avatar</TableHead>
                  <TableHead>Patient Name</TableHead>
                  {user?.role === "user" && <TableHead>Doctor Name</TableHead>}
                  <TableHead>Reason</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Payment</TableHead>
                  {userRole === "user" && (
                    <TableHead className="min-w-16"></TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments?.map((appointment, index) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      {user.role === "user" ? (
                        // Show doctor's profile when user is viewing
                        <Link
                          target="_blank"
                          href={`/profile/doctor/${appointment.doctorId}`}
                        >
                          <ProfilePicture
                            image={
                              appointment.doctor?.pfp
                                ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${appointment.doctor?.pfp}`
                                : undefined
                            }
                          />
                        </Link>
                      ) : user.role === "doctor" ? (
                        // Show patient's profile when doctor is viewing
                        <Link
                          target="_blank"
                          href={`/profile/${appointment.patientId}`}
                        >
                          <ProfilePicture
                            image={
                              appointment.patient?.pfp
                                ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${appointment.patient?.pfp}`
                                : undefined
                            }
                          />
                        </Link>
                      ) : (
                        <ProfilePicture />
                      )}
                    </TableCell>
                    <TableCell
                      className={`${
                        appointment.status === "OUTDATED" ? "line-through" : ""
                      }`}
                    >
                      {appointment.fullname}
                    </TableCell>
                    {user?.role === "user" && (
                      <TableCell
                        className={`${
                          appointment.status === "OUTDATED"
                            ? "line-through"
                            : ""
                        }`}
                      >
                        {appointment.doctor?.name}
                      </TableCell>
                    )}
                    <TableCell
                      className={`${
                        appointment.status === "OUTDATED" ? "line-through" : ""
                      }`}
                    >
                      {appointment.reasonForVisit}
                    </TableCell>
                    <TableCell
                      className={`${
                        appointment.status === "OUTDATED" ? "line-through" : ""
                      }`}
                    >
                      {appointment.preferredTime}
                    </TableCell>
                    <TableCell
                      className={`${
                        appointment.status === "OUTDATED" ? "line-through" : ""
                      }`}
                    >
                      {appointment.preferredDate.toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell className="cursor-pointer">
                      {user?.role === "user" ||
                      appointment.status === "OUTDATED" ? (
                        appointmentBadge(appointment.status, {
                          doctorName:
                            user?.appointmentsAsPatient[index]?.doctor?.name,
                          fee: user?.appointmentsAsPatient[index]?.doctor
                            ?.doctorProfile?.consultationFee,
                          appointmentId: appointment.id,
                        })
                      ) : appointment.status === AppointmentStatus.COMPLETED ? (
                        <Badge className="bg-green-500 text-white hover:bg-green-600">
                          {appointment.status}
                        </Badge>
                      ) : (
                        <EditAppointmentStatus
                          appointmentId={appointment.id}
                          currentPage={page}
                          currentStatus={
                            appointment.status as AppointmentStatus
                          }
                        />
                      )}
                    </TableCell>

                    <TableCell>
                      <MessagesSectionForList
                        userRole={user?.role}
                        appointment={appointment}
                      />
                    </TableCell>
                    <TableCell>
                      {setPaymentStatus(
                        appointment.status,
                        appointment.is_paid,
                        {
                          doctorName:
                            user?.appointmentsAsPatient[index]?.doctor?.name,
                          fee: user?.appointmentsAsPatient[index]?.doctor
                            ?.doctorProfile?.consultationFee,
                          appointmentId: appointment.id,
                        }
                      )}
                    </TableCell>
                    {userRole === "user" && (
                      <TableCell>
                        <div className="w-full flex justify-end">
                          <DeleteAppointmentBtn appId={appointment.id} />
                        </div>
                      </TableCell>
                    )}
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
