import "server-only";

import { cache } from "react";
import { prisma } from "../db/prisma";
import { ContactFormType } from "../definitions";
import { NotificationType } from "@prisma/client/edge";
import { getUserIdnRoleIfAuthenticated } from "../session";

export const setAppointmentToDB = cache(
  async (data: {
    fullname: string;
    email: string;
    phone?: string;
    reasonForVisit: string;
    preferredDate: string;
    preferredTime: string;
    patientId?: string;
    doctorId: string;
  }) => {
    const {
      fullname,
      email,
      phone,
      reasonForVisit,
      preferredDate,
      preferredTime,
      patientId,
      doctorId,
    } = data;

    const date = new Date(preferredDate);
    // 1. Create the appointment
    const appointment = await prisma.appointments.create({
      data: {
        fullname,
        email,
        phone,
        reasonForVisit,
        preferredDate: date,
        preferredTime,
        doctor: {
          connect: { id: doctorId },
        },
        ...(patientId && {
          patient: {
            connect: { id: patientId },
          },
        }),
      },
    });

    // 2. Prepare notification message
    const message = `A new appointment was created for patient "${fullname}" scheduled on "${preferredDate}" at "${preferredTime}".`;

    // 3. Create notification for doctor
    await prisma.notification.create({
      data: {
        userId: doctorId,
        title: "New Appointment Scheduled",
        message,
        type: "APPOINTMENT_UPDATE",
      },
    });

    // 4. Create notification for patient (if registered)
    if (patientId) {
      await prisma.notification.create({
        data: {
          userId: patientId,
          title: "Appointment Request Submitted",
          message: `Your appointment with the doctor has been requested for "${preferredDate}" at "${preferredTime}". Please await confirmation.`,
          type: "APPOINTMENT_UPDATE",
        },
      });
    }

    // 5. Create notifications for all admins
    const admins = await prisma.user.findMany({
      where: {
        role: "admin",
      },
    });

    await Promise.all(
      admins.map((admin) =>
        prisma.notification.create({
          data: {
            userId: admin.id,
            title: "New Appointment Booked",
            message,
            type: "APPOINTMENT_UPDATE",
          },
        })
      )
    );

    return appointment;
  }
);

export const uploadInquiry = cache(async (data: ContactFormType) => {
  const submitted = await prisma.inquiries.create({
    data: {
      fullname: data.fullname,
      email: data.email,
      inquiry: data.inquiry,
    },
  });

  const admins = await prisma.user.findMany({
    where: {
      role: "admin",
    },
  });

  // notification for admins
  await Promise.all(
    admins.map((admin) =>
      prisma.notification.create({
        data: {
          userId: admin.id,
          title: "New Inquiry",
          message: `New Inquiry from "${data.fullname}".`,
          type: "GENERAL_ANNOUNCEMENT",
        },
      })
    )
  );
  return submitted;
});

export const uploadProfileChanges = cache(
  async (data: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    imageUploadUrl: string;
  }) => {
    const { email, imageUploadUrl, ...rest } = data;
    const filteredData = Object.fromEntries(
      Object.entries(rest).filter(([_, value]) => value !== "")
    );

    const updateData: any = {
      ...filteredData,
    };

    if (imageUploadUrl !== "") {
      updateData.pfp = imageUploadUrl;
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: updateData,
      });

      if (updatedUser) return 1;
    } catch {
      return 0;
    }
  }
);

export async function getTokensUsedFromDB(userId: string) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
      is_verified: true,
    },
    select: {
      ai_tokens_used: true,
    },
  });
}

export async function getUserNotificationsFromDB(userId: string) {
  return await prisma.notification.findMany({
    where: {
      userId,
    },
  });
}
export async function markNotificationAsReadInDB(notificationId: string) {
  return await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      read: true,
    },
  });
}
export async function markNotificationAsUnreadInDB(notificationId: string) {
  return await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      read: false,
    },
  });
}

export async function markAllNotificationsAsReadInDB(userId: string) {
  await prisma.notification.updateMany({
    where: {
      userId,
    },
    data: {
      read: true,
    },
  });
}

export async function getAuthUserWithAppointmentsFromDB() {
  const session = await getUserIdnRoleIfAuthenticated();
  const user = await prisma.user.findUnique({
    where: { id: session?.userId },
    include: {
      appointmentsAsPatient: { orderBy: { updatedAt: "desc" } },
      appointmentsAsDoctor: { orderBy: { updatedAt: "desc" } },
    },
  });
  return user;
}

export async function deleteNotificationFromDB(id: string) {
  await prisma.notification.delete({
    where: { id },
  });
}
