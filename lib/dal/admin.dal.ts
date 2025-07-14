import "server-only";

import { prisma } from "../db/prisma";
import { DoctorType, UserRole } from "@prisma/client/edge";
import cloudinary from "../cloudinary";
import { getUserIdnRoleIfAuthenticated } from "../session";
import { subDays, format, eachDayOfInterval } from "date-fns";

export const getAllVerifiedUsersFromDB = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        is_verified: true,
      },
      select: {
        pfp: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error("Error in getAllVerifiedUsersFromDB:", error);
    throw new Error("Failed to fetch verified users");
  }
};

export const getAllAppointmentsFromDB = async (page: number, limit: number) => {
  try {
    const [appointments, count] = await Promise.all([
      prisma.appointments.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          preferredDate: "desc",
        },
        select: {
          fullname: true,
          id: true,
          email: true,
          preferredDate: true,
          preferredTime: true,
          reasonForVisit: true,
          doctorId: true,
          status: true,
          doctor: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      }),
      prisma.appointments.count(),
    ]);

    return {
      appointments,
      count,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error("Error in getAllAppointmentsFromDB:", error);
    throw new Error("Failed to fetch appointments");
  }
};

export const getAllUsersFromDB = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const user = await getUserIdnRoleIfAuthenticated();

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        NOT: {
          id: user?.userId,
        },
      },
      select: {
        id: true,
        pfp: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
        is_verified: true,
        ai_tokens_used: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count({}),
  ]);

  return {
    users,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getInquiriesFromDB = async () => {
  return await prisma.inquiries.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      is_read: false,
    },
  });
};

export const getInquiriesForPaginationFromDB = async (
  page: number,
  limit: number
) => {
  const [inquiries, count] = await Promise.all([
    prisma.inquiries.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.inquiries.count(),
  ]);

  return {
    inquiries,
    count,
  };
};

export const getAppointmentsFromDB = async () => {
  return await prisma.appointments.findMany({
    orderBy: {
      preferredDate: "desc",
    },
    include: {
      doctor: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const getAllDoctorsFromDB = async () => {
  const doctors = await prisma.user.findMany({
    where: {
      role: "doctor",
      doctorProfile: {
        isApproved: true,
      },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      pfp: true,
      role: true,
      createdAt: true,
      doctorProfile: true,
    },
  });

  return doctors;
};

export const addNewDoctorToDB = async (
  name: string,
  email: string,
  hashedPassword: string,
  docType: DoctorType
) => {
  const existingDoc = await prisma.user.findUnique({
    where: { email },
  });
  if (existingDoc) return 2;

  const newDoc = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "doctor",
      is_verified: true,
    },
  });

  await prisma.doctorProfile.create({
    data: {
      userId: newDoc.id,
      doctorType: docType,
      isApproved: true,
    },
  });

  return newDoc;
};

export const deleteInquiryFromDB = async (inquiryId: string) => {
  return await prisma.inquiries.delete({
    where: {
      id: inquiryId,
    },
  });
};

export const deleteDoctorFromDB = async (userId: string) => {
  // Get all messages that have images
  const messagesWithImages = await prisma.message.findMany({
    where: {
      chat: {
        userId,
      },
      NOT: {
        image: null,
      },
    },
    select: {
      image: true,
    },
  });
  const imageUrls = messagesWithImages.map((m) => m.image).filter(Boolean);

  // Get profile Image and delete it
  const activeUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  const profilePicture = activeUser?.pfp;
  if (profilePicture) await cloudinary.uploader.destroy(profilePicture);

  // Delete messages and chats
  const deleteRes = await prisma.$transaction([
    prisma.message.deleteMany({
      where: {
        chat: {
          userId,
        },
      },
    }),

    prisma.chatSession.deleteMany({
      where: {
        userId,
      },
    }),

    prisma.account.deleteMany({
      where: {
        userId,
      },
    }),

    prisma.doctorProfile.deleteMany({
      where: {
        userId,
      },
    }),

    prisma.appointments.deleteMany({
      where: {
        patientId: userId,
      },
    }),

    prisma.user.delete({
      where: {
        id: userId,
      },
    }),
  ]);

  for (const id of imageUrls) {
    await cloudinary.uploader.destroy(id!);
  }

  return deleteRes;
};

export const deleteAppointmentFromDB = async (appId: string) => {
  const deleted = await prisma.appointments.delete({
    where: { id: appId },
  });

  // notification for patient
  await prisma.notification.create({
    data: {
      userId: deleted.patientId!,
      title: "Appointment Deleted By Admin",
      message: `Appointment of patient "${deleted.fullname}" that was set to be on "${deleted.preferredDate}" is deleted by admin.`,
      type: "APPOINTMENT_UPDATE",
    },
  });

  // notification for doctor
  await prisma.notification.create({
    data: {
      userId: deleted.doctorId!,
      title: "Appointment Deleted By Admin",
      message: `Appointment of patient "${deleted.fullname}" that was set to be on "${deleted.preferredDate}" is deleted by admin.`,
      type: "APPOINTMENT_UPDATE",
    },
  });

  return deleted;
};

export const deleteUserFromDB = async (userId: string) => {
  // Get all messages that have images
  const messagesWithImages = await prisma.message.findMany({
    where: {
      chat: {
        userId,
      },
      NOT: {
        image: null,
      },
    },
    select: {
      image: true,
    },
  });
  const imageUrls = messagesWithImages.map((m) => m.image).filter(Boolean);

  // Get profile Image and delete it
  const activeUser = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });
  const profilePicture = activeUser?.pfp;
  if (profilePicture) await cloudinary.uploader.destroy(profilePicture);

  // Delete messages and chats
  // Delete messages and chats
  const deleteRes = await prisma.$transaction([
    prisma.message.deleteMany({
      where: {
        chat: {
          userId,
        },
      },
    }),

    prisma.chatSession.deleteMany({
      where: {
        userId,
      },
    }),

    prisma.account.deleteMany({
      where: {
        userId,
      },
    }),

    prisma.doctorProfile.deleteMany({
      where: {
        userId,
      },
    }),

    prisma.appointments.deleteMany({
      where: {
        patientId: userId,
      },
    }),

    prisma.user.delete({
      where: {
        id: userId,
      },
    }),
  ]);

  for (const id of imageUrls) {
    await cloudinary.uploader.destroy(id!);
  }

  return deleteRes;
};

export const changeUserRoleFromDB = async (
  userId: string,
  role: UserRole,
  currentRole: UserRole
) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  });

  // notification for user
  await prisma.notification.create({
    data: {
      userId: user.id!,
      title: "Role changed by Admin",
      message: `Your profile role is changed by Admin from "${currentRole}" to "${role}".`,
      type: "GENERAL_ANNOUNCEMENT",
    },
  });

  if (currentRole === "doctor") {
    await prisma.doctorProfile.delete({
      where: { userId },
    });

    await prisma.appointments.updateMany({
      where: {
        doctorId: user.id,
      },
      data: {
        doctorId: null,
      },
    });
  }

  if (role === "doctor") {
    await prisma.doctorProfile.create({
      data: {
        userId: user.id,
        doctorType: "general",
        isApproved: true,
      },
    });
  }

  return;
};

export const changeUserVerificationStatusFromDB = async (
  userId: string,
  status: "0" | "1"
) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      is_verified: status === "1" ? true : false,
    },
  });

  return;
};

export const getAdminDashboardNumbersFromDB = async () => {
  const [verifiedUsers, verifiedDoctors, unreadInquiries, pendingAppointments] =
    await Promise.all([
      prisma.user.count({
        where: {
          is_verified: true,
        },
      }),
      prisma.user.count({
        where: {
          doctorProfile: {
            isApproved: true,
          },
        },
      }),
      prisma.inquiries.count({
        where: {
          is_read: false,
        },
      }),
      prisma.appointments.count({
        where: {
          status: "PENDING",
        },
      }),
    ]);

  return {
    verifiedUsers,
    verifiedDoctors,
    unreadInquiries,
    pendingAppointments,
  };
};

export const getNewUserInfoFromDB = async () => {
  const start = subDays(new Date(), 90);

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: start,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by date
  const grouped: Record<string, number> = {};
  users.forEach((user) => {
    const dateStr = format(user.createdAt, "yyyy-MM-dd");
    grouped[dateStr] = (grouped[dateStr] || 0) + 1;
  });

  // Fill in missing days
  const allDates = eachDayOfInterval({ start, end: new Date() });
  const final = allDates.map((date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return {
      date: dateStr,
      number: grouped[dateStr] || 0,
    };
  });
  await new Promise((res) => setTimeout(res, 2000));
  return final;
};

export const changeInquiryStatusFromDB = async (id: string) => {
  const inquiry = await prisma.inquiries.findUnique({
    where: { id },
    select: { is_read: true },
  });

  if (!inquiry) return;

  await prisma.inquiries.update({
    where: { id },
    data: {
      is_read: !inquiry.is_read,
    },
  });
};

export async function updateAdminProfileInDB(adminData: {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  pfp: string;
}) {
  const { id, name, email, phone, dob, gender, pfp } = adminData;

  const existingAdmin = await prisma.user.findUnique({
    where: { id },
    select: { pfp: true },
  });

  if (existingAdmin?.pfp && existingAdmin.pfp !== pfp) {
    await cloudinary.uploader.destroy(existingAdmin.pfp);
  }

  return await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      phone,
      dob,
      gender,
      pfp,
    },
  });
}

export const changeAppointmentDoctorFromDB = async (
  appointmentId: string,
  doctor: string,
  currentDoctor: string
) => {
  try {
    const doctorId = doctor === "Unassigned" ? null : doctor;

    const updatedAppointment = await prisma.appointments.update({
      where: { id: appointmentId },
      data: { doctorId },
    });

    // notification for patient
    await prisma.notification.create({
      data: {
        userId: updatedAppointment.patientId!,
        title: "Appointment Doctor Changed By Admin",
        message: `Appointment of patient "${updatedAppointment.fullname}" that was set to be on "${updatedAppointment.preferredDate}" is updated by reassigning your Doctor.`,
        type: "APPOINTMENT_UPDATE",
      },
    });

    // notification for old doctor
    await prisma.notification.create({
      data: {
        userId: currentDoctor!,
        title: "Appointment Doctor Changed By Admin",
        message: `Appointment of patient "${updatedAppointment.fullname}" that was set to be on "${updatedAppointment.preferredDate}" is updated by reassigning their Doctor.`,
        type: "APPOINTMENT_UPDATE",
      },
    });

    // notification for new doctor
    await prisma.notification.create({
      data: {
        userId: updatedAppointment.doctorId!,
        title: "New Appointment By Admin",
        message: `New Appointment of patient "${updatedAppointment.fullname}" that is set to be on "${updatedAppointment.preferredDate}".`,
        type: "APPOINTMENT_UPDATE",
      },
    });

    return updatedAppointment;
  } catch (error) {
    console.error("Error in changeAppointmentDoctorFromDB:", error);
    throw new Error("Failed to change appointment doctor");
  }
};
