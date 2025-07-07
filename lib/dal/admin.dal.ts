import "server-only";

import { prisma } from "../db/prisma";
import { DoctorType, UserRole } from "@prisma/client/edge";
import cloudinary from "../cloudinary";
import { getUserIdnRoleIfAuthenticated } from "../session";

export const getAllVerifiedUsersFromDB = async () => {
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
};

export const getAllAppointmentsFromDB = async (page: number, limit: number) => {
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

export const getAllDoctorsFromDB = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [doctors, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: "doctor",
        doctorProfile: {
          isApproved: true,
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        pfp: true,
        role: true,
        createdAt: true,
        doctorProfile: {
          select: {
            doctorType: true,
          },
        },
      },
    }),
    prisma.user.count({
      where: { role: "doctor", doctorProfile: { isApproved: true } },
    }),
  ]);

  return {
    doctors,
    total,
    totalPages: Math.ceil(total / limit),
  };
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
  return await prisma.appointments.delete({
    where: { id: appId },
  });
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

export const changeInquiryStatusFromDB = async (id: string) => {
  const inquiry = await prisma.inquiries.findUnique({
    where: { id },
    select: { is_read: true },
  });

  if (!inquiry) throw new Error("Inquiry not found");

  await prisma.inquiries.update({
    where: { id },
    data: {
      is_read: !inquiry.is_read,
    },
  });
};

import { subDays, format, eachDayOfInterval } from "date-fns";

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
await new Promise(res=>setTimeout(res,2000))
  return final;
};
