import "server-only";

import { prisma } from "../db/prisma";
import { DoctorType } from "@prisma/client/edge";
import cloudinary from "../cloudinary";

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
export const getAllUsersFromDB = async (page:number, limit:number) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: "user" },
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
    prisma.user.count({
      where: {
        role: "user",
      },
    }),
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

export const deleteDoctorFromDB = async (doctorId: string) => {
  // For cloudinary Deleting Images
  const doc = await prisma.user.findUnique({
    where: {
      id: doctorId,
    },
    select: {
      pfp: true,
    },
  });

  if (doc?.pfp) {
    await cloudinary.uploader.destroy(doc.pfp);
  }

  // Deleting accounts
  const deleteRes = await prisma.$transaction([
    prisma.doctorProfile.delete({
      where: {
        userId: doctorId,
      },
    }),
    prisma.user.delete({
      where: {
        id: doctorId,
      },
    }),
  ]);
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
