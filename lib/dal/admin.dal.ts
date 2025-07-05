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
  });
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

export const deleteUserFromDB = async (userId: string) => {
  try {
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
    await prisma.$transaction(async (tx) => {
      await tx.message.deleteMany({
        where: {
          chat: {
            userId,
          },
        },
      });

      await tx.chatSession.deleteMany({
        where: {
          userId,
        },
      });

      await tx.account.deleteMany({
        where: {
          userId,
        },
      });

      await tx.doctorProfile.deleteMany({
        where: {
          userId,
        },
      });

      await tx.appointments.deleteMany({
        where: {
          patientId: userId,
        },
      });

      await tx.user.delete({
        where: {
          id: userId,
        },
      });
    });

    for (const id of imageUrls) {
      await cloudinary.uploader.destroy(id!);
    }
    return 1;
  } catch (error) {
    console.log("Catching");
    return 0;
  }
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
