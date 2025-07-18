import "server-only";

import { cache } from "react";
import { prisma } from "../db/prisma";
import { ContactFormType } from "../definitions";
import { getUserIdnRoleIfAuthenticated } from "../session";
import { AppointmentStatus, UserRole } from "@prisma/client";

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

    try {
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
      const message = `A new appointment was created for patient "${fullname}" scheduled on "${date.toLocaleDateString(
        "en-GB"
      )}" at "${preferredTime}".`;

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
            message: `Your appointment with the doctor has been requested for "${date.toLocaleDateString(
              "en-GB"
            )}" at "${preferredTime}". Please await confirmation.`,
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
    } catch (error) {
      console.error(error);
      return;
    }
  }
);

export const uploadInquiry = cache(async (data: ContactFormType) => {
  try {
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
  } catch (error) {
    console.error(error);
    return;
  }
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
    } catch (error) {
      console.error(error);
      return;
    }
  }
);

export async function getTokensUsedFromDB(userId: string) {
  try {
    const res = await prisma.user.findUnique({
      where: {
        id: userId,
        is_verified: true,
      },
      select: {
        ai_tokens_used: true,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function getUserNotificationsFromDB(userId: string) {
  try {
    return await prisma.notification.findMany({
      where: {
        userId,
      },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function markNotificationAsReadInDB(notificationId: string) {
  try {
    return await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function markNotificationAsUnreadInDB(notificationId: string) {
  try {
    return await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: false,
      },
    });
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function markAllNotificationsAsReadInDB(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: {
        userId,
      },
      data: {
        read: true,
      },
    });
  } catch (error) {
    console.error(error);
    return;
  }
}

export type AppointmentWithUnreadFlag = {
  id: string;
  updatedAt: Date;
  email: string;
  phone: string | null;
  createdAt: Date;
  fullname: string;
  reasonForVisit: string;
  preferredDate: Date;
  preferredTime: string;
  status: string;
  doctorId: string | null;
  patientId: string | null;
  appointmentMessages: { id: string }[];
  hasUnreadReceivedMessages: boolean;
  doctor?: {
    doctorProfile?: { consultationFee: number };
    name?: string;
  };
};

export type AuthUserWithAppointmentsAndMessages = {
  role: UserRole;
  appointmentsAsPatient: AppointmentWithUnreadFlag[];
  appointmentsAsDoctor: AppointmentWithUnreadFlag[];
  page: number;
  totalPages: number;
};

export async function getAuthUserWithAppointmentsAndUnreadReceivedMessagesFromDB(
  page: number,
  limit: number
): Promise<AuthUserWithAppointmentsAndMessages | null> {
  const skip = (page - 1) * limit;

  try {
    const session = await getUserIdnRoleIfAuthenticated();
    if (!session?.userId) return null;

    // Fetch total counts first
    const [patientCount, doctorCount] = await Promise.all([
      prisma.appointments.count({
        where: { patientId: session.userId },
      }),
      prisma.appointments.count({
        where: { doctorId: session.userId },
      }),
    ]);

    const totalCount = patientCount + doctorCount;
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch paginated appointments
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        role: true,
        appointmentsAsPatient: {
          orderBy: { updatedAt: "desc" },
          skip,
          take: limit,
          include: {
            doctor: {
              select: {
                doctorProfile: {
                  select: {
                    consultationFee: true,
                  },
                },
                name: true,
              },
            },
          },
        },
        appointmentsAsDoctor: {
          orderBy: { updatedAt: "desc" },
          skip,
          take: limit,
        },
      },
    });

    if (!user) return null;

    const appointmentIds = [
      ...user.appointmentsAsPatient.map((a) => a.id),
      ...user.appointmentsAsDoctor.map((a) => a.id),
    ];

    // Fetch unread messages
    const unreadMessages = await prisma.appointmentMessage.findMany({
      where: {
        appointmentId: { in: appointmentIds },
        is_read: false,
        receiverId: session.userId,
      },
      select: { appointmentId: true },
    });

    const unreadMap = new Set(unreadMessages.map((m) => m.appointmentId));

    const processAppointments = (appointments: any[]) =>
      appointments.map((appointment) => ({
        ...appointment,
        hasUnreadReceivedMessages: unreadMap.has(appointment.id),
      }));

    return {
      role: user.role,
      appointmentsAsPatient: processAppointments(user.appointmentsAsPatient),
      appointmentsAsDoctor: processAppointments(user.appointmentsAsDoctor),
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Failed to get authenticated user with appointments:", error);
    return null;
  }
}

export async function deleteNotificationFromDB(id: string) {
  try {
    await prisma.notification.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Failed to delete notification with ID ${id}:`, error);
    throw new Error("Could not delete notification");
  }
}

export async function sendAppointmentMessageToDB({
  senderId,
  receiverId,
  appointmentId,
  content,
  title,
}: {
  title: string;
  senderId: string;
  receiverId: string;
  appointmentId: string;
  content: string;
}) {
  try {
    await prisma.appointmentMessage.create({
      data: {
        receiverId,
        content,
        senderId,
        appointmentId,
        title,
      },
    });
  } catch (error) {
    console.error("Failed to send message to appointment:", error);
    throw new Error("Could not send message");
  }
}

export async function getAppointmentMessagesCountFromDB(userId: string) {
  try {
    const res = await prisma.appointmentMessage.count({
      where: {
        receiverId: userId,
        is_read: false,
        appointment: {
          NOT: {
            status: "CANCELLED",
          },
        },
      },
    });
    return res;
  } catch (error) {
    console.error("Failed to count unread appointment messages:", error);
    return 0;
  }
}

export async function getAppointmentMessagesOfSentFromDB(
  userId: string,
  appointmentId: string
) {
  try {
    const res = await prisma.appointmentMessage.findMany({
      where: {
        senderId: userId,
        appointmentId,
        appointment: {
          NOT: {
            status: "CANCELLED",
          },
        },
      },
    });
    return res;
  } catch (error) {
    console.error("Failed to get sender messages:", error);
    return [];
  }
}

export async function getAppointmentMessagesOfReceivedFromDB(
  userId: string,
  appointmentId: string
) {
  try {
    const res = await prisma.appointmentMessage.findMany({
      where: {
        receiverId: userId,
        appointmentId,
        appointment: {
          NOT: {
            status: "CANCELLED",
          },
        },
      },
    });
    return res;
  } catch (error) {
    console.error("Failed to get receiver messages:", error);
    return [];
  }
}

export async function deleteAppointmentSentMessageFromDB(id: string) {
  try {
    await prisma.appointmentMessage.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function markReadAppointmentMessageInDB(id: string) {
  try {
    await prisma.appointmentMessage.update({
      where: {
        id,
      },
      data: {
        is_read: true,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function setAppointmentIsPaidTrueInDB(id: string) {
  const updated = await prisma.appointments.update({
    where: {
      id,
    },
    data: {
      is_paid: true,
      status: "PAID",
    },
    include: {
      doctor: {
        select: {
          name: true,
        },
      },
    },
  });

  // notification for patient
  await prisma.notification.create({
    data: {
      userId: updated.patientId!,
      title: "Payment Successful",
      message: `"${updated.fullname}'s" appointment's payment is successful to "${updated.doctor?.name}"`,
      type: "APPOINTMENT_UPDATE",
    },
  });

  // notification for doctor
  await prisma.notification.create({
    data: {
      userId: updated.doctorId!,
      title: "Payment Successful",
      message: `"${updated.fullname}'s" appointment's payment is successful to "${updated.doctor?.name}"`,
      type: "APPOINTMENT_UPDATE",
    },
  });
}
