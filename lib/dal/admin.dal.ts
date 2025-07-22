import "server-only";

import { prisma } from "../db/prisma";
import { DoctorType, UserRole } from "@prisma/client/edge";
import cloudinary from "../cloudinary";
import { getUserIdnRoleIfAuthenticated } from "../session";
import { subDays, format, eachDayOfInterval } from "date-fns";

export const getAllVerifiedUsersFromDB = async () => {
  try {
    const users = await prisma.user.findMany({
      where: { is_verified: true },
      select: {
        pfp: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
      },
      take: 10,
      orderBy: { createdAt: "desc" },
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
        orderBy: { preferredDate: "desc" },
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
            select: { name: true, id: true },
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
  try {
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
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error in getAllUsersFromDB:", error);
    throw new Error("Failed to fetch users");
  }
};

export const getInquiriesFromDB = async () => {
  try {
    return await prisma.inquiries.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      where: { is_read: false },
    });
  } catch (error) {
    console.error("Error in getInquiriesFromDB:", error);
    return [];
  }
};

export const getInquiriesForPaginationFromDB = async (
  page: number,
  limit: number
) => {
  try {
    const [inquiries, count] = await Promise.all([
      prisma.inquiries.findMany({
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.inquiries.count(),
    ]);

    return { inquiries, count };
  } catch (error) {
    console.error("Error in getInquiriesForPaginationFromDB:", error);
    return { inquiries: [], count: 0 };
  }
};

export const getAppointmentsFromDB = async () => {
  try {
    return await prisma.appointments.findMany({
      orderBy: { preferredDate: "desc" },
      include: {
        doctor: {
          select: { name: true },
        },
      },
    });
  } catch (error) {
    console.error("Error in getAppointmentsFromDB:", error);
    return [];
  }
};

export const getAllDoctorsFromDB = async () => {
  try {
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
  } catch (error) {
    console.error("Error in getAllDoctorsFromDB:", error);
    return [];
  }
};

export const addNewDoctorToDB = async (
  name: string,
  email: string,
  hashedPassword: string,
  docType: DoctorType
) => {
  try {
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
  } catch (error) {
    console.error("Error in addNewDoctorToDB:", error);
    return null;
  }
};

export const deleteInquiryFromDB = async (inquiryId: string) => {
  try {
    return await prisma.inquiries.delete({
      where: { id: inquiryId },
    });
  } catch (error) {
    console.error("Error in deleteInquiryFromDB:", error);
    return null;
  }
};

export const deleteDoctorFromDB = async (userId: string) => {
  try {
    const messagesWithImages = await prisma.message.findMany({
      where: {
        chat: { userId },
        NOT: { image: null },
      },
      select: { image: true },
    });
    const imageUrls = messagesWithImages.map((m) => m.image).filter(Boolean);

    const activeUser = await prisma.user.findFirst({ where: { id: userId } });
    const profilePicture = activeUser?.pfp;
    if (profilePicture) await cloudinary.uploader.destroy(profilePicture);

    const deleteRes = await prisma.$transaction([
      prisma.message.deleteMany({ where: { chat: { userId } } }),
      prisma.chatSession.deleteMany({ where: { userId } }),
      prisma.account.deleteMany({ where: { userId } }),
      prisma.doctorProfile.deleteMany({ where: { userId } }),
      prisma.notification.deleteMany({ where: { userId } }),
      prisma.appointmentMessage.deleteMany({ where: { senderId: userId } }),
      prisma.appointmentMessage.deleteMany({ where: { receiverId: userId } }),
      prisma.appointments.deleteMany({ where: { patientId: userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    for (const id of imageUrls) {
      await cloudinary.uploader.destroy(id!);
    }

    return deleteRes;
  } catch (error) {
    console.error("Error in deleteDoctorFromDB:", error);
    return null;
  }
};

export const deleteAppointmentFromDB = async (appId: string) => {
  try {
    await prisma.appointments.delete({ where: { id: appId } })
    const deleted = await prisma.appointments.delete({ where: { id: appId } });

    await Promise.all([
      prisma.notification.create({
        data: {
          userId: deleted.patientId!,
          title: "Appointment Deleted By Admin",
          message: `Appointment of patient "${
            deleted.fullname
          }" that was set to be on "${deleted.preferredDate.toLocaleDateString(
            "en-GB"
          )}" is deleted by admin.`,
          type: "APPOINTMENT_UPDATE",
        },
      }),
      prisma.notification.create({
        data: {
          userId: deleted.doctorId!,
          title: "Appointment Deleted By Admin",
          message: `Appointment of patient "${
            deleted.fullname
          }" that was set to be on "${deleted.preferredDate.toLocaleDateString(
            "en-GB"
          )}" is deleted by admin.`,
          type: "APPOINTMENT_UPDATE",
        },
      }),
    ]);

    return deleted;
  } catch (error) {
    console.error("Error in deleteAppointmentFromDB:", error);
    return null;
  }
};

export const deleteUserFromDB = async (userId: string) => {
  try {
    const messagesWithImages = await prisma.message.findMany({
      where: {
        chat: { userId },
        NOT: { image: null },
      },
      select: { image: true },
    });
    const imageUrls = messagesWithImages.map((m) => m.image).filter(Boolean);

    const activeUser = await prisma.user.findFirst({ where: { id: userId } });
    const profilePicture = activeUser?.pfp;
    if (profilePicture) await cloudinary.uploader.destroy(profilePicture);

    const deleteRes = await prisma.$transaction([
      prisma.message.deleteMany({ where: { chat: { userId } } }),
      prisma.chatSession.deleteMany({ where: { userId } }),
      prisma.account.deleteMany({ where: { userId } }),
      prisma.doctorProfile.deleteMany({ where: { userId } }),
      prisma.notification.deleteMany({ where: { userId } }),
      prisma.appointmentMessage.deleteMany({ where: { senderId: userId } }),
      prisma.appointmentMessage.deleteMany({ where: { receiverId: userId } }),
      prisma.appointments.deleteMany({ where: { patientId: userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);

    for (const id of imageUrls) {
      await cloudinary.uploader.destroy(id!);
    }

    return deleteRes;
  } catch (error) {
    console.error("Error in deleteUserFromDB:", error);
    return null;
  }
};

export const changeUserRoleFromDB = async (
  userId: string,
  role: UserRole,
  currentRole: UserRole
) => {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    await prisma.notification.create({
      data: {
        link: "/your-appointments",
        userId: user.id,
        title: "Role changed by Admin",
        message: `Your profile role is changed by Admin from "${currentRole}" to "${role}".`,
        type: "GENERAL_ANNOUNCEMENT",
      },
    });

    if (currentRole === "doctor") {
      await prisma.doctorProfile.delete({ where: { userId } });
      await prisma.appointments.updateMany({
        where: { doctorId: user.id },
        data: { doctorId: null },
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
  } catch (error) {
    console.error("Error in changeUserRoleFromDB:", error);
    return;
  }
};

export const changeUserVerificationStatusFromDB = async (
  userId: string,
  status: "0" | "1"
) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { is_verified: status === "1" },
    });
  } catch (error) {
    console.error("Error in changeUserVerificationStatusFromDB:", error);
  }
};

export const getAdminDashboardNumbersFromDB = async () => {
  try {
    const [
      verifiedUsers,
      verifiedDoctors,
      unreadInquiries,
      pendingAppointments,
    ] = await Promise.all([
      prisma.user.count({ where: { is_verified: true } }),
      prisma.user.count({ where: { doctorProfile: { isApproved: true } } }),
      prisma.inquiries.count({ where: { is_read: false } }),
      prisma.appointments.count({ where: { status: "PENDING" } }),
    ]);

    return {
      verifiedUsers,
      verifiedDoctors,
      unreadInquiries,
      pendingAppointments,
    };
  } catch (error) {
    console.error("Error in getAdminDashboardNumbersFromDB:", error);
    return {
      verifiedUsers: 0,
      verifiedDoctors: 0,
      unreadInquiries: 0,
      pendingAppointments: 0,
    };
  }
};

export const getNewUserInfoFromDB = async () => {
  try {
    const start = subDays(new Date(), 90);

    const users = await prisma.user.findMany({
      where: { createdAt: { gte: start } },
      orderBy: { createdAt: "asc" },
    });

    const grouped: Record<string, number> = {};
    users.forEach((user) => {
      const dateStr = format(user.createdAt, "yyyy-MM-dd");
      grouped[dateStr] = (grouped[dateStr] || 0) + 1;
    });

    const allDates = eachDayOfInterval({ start, end: new Date() });
    const final = allDates.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return {
        date: dateStr,
        number: grouped[dateStr] || 0,
      };
    });

    await new Promise((res) => setTimeout(res, 2000)); // Simulate delay
    return final;
  } catch (error) {
    console.error("Error in getNewUserInfoFromDB:", error);
    return [];
  }
};

export const changeInquiryStatusFromDB = async (id: string) => {
  try {
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
  } catch (error) {
    console.error("Error in changeInquiryStatusFromDB:", error);
    return null;
  }
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
  try {
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
  } catch (error) {
    console.error("Error in updateAdminProfileInDB:", error);
    return null;
  }
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
      data: {
        doctorId,
        updatedAt: new Date(),
      },
    });

    const notifications = [];

    if (updatedAppointment.patientId) {
      notifications.push(
        prisma.notification.create({
          data: {
            link: "/your-appointments",
            userId: updatedAppointment.patientId,
            title: "Appointment Doctor Changed By Admin",
            message: `Appointment of patient "${
              updatedAppointment.fullname
            }" that was set to be on "${updatedAppointment.preferredDate.toLocaleDateString(
              "en-GB"
            )}" is updated by reassigning your Doctor.`,
            type: "APPOINTMENT_UPDATE",
          },
        })
      );
    }

    if (currentDoctor) {
      notifications.push(
        prisma.notification.create({
          data: {
            userId: currentDoctor,
            title: "Appointment Doctor Changed By Admin",
            message: `Appointment of patient "${
              updatedAppointment.fullname
            }" that was set to be on "${updatedAppointment.preferredDate.toLocaleDateString(
              "en-GB"
            )}" is updated by reassigning their Doctor.`,
            type: "APPOINTMENT_UPDATE",
          },
        })
      );
    }

    if (updatedAppointment.doctorId) {
      notifications.push(
        prisma.notification.create({
          data: {
            link: "/your-appointments",
            userId: updatedAppointment.doctorId,
            title: "New Appointment By Admin",
            message: `New Appointment of patient "${
              updatedAppointment.fullname
            }" that is set to be on "${updatedAppointment.preferredDate.toLocaleDateString(
              "en-GB"
            )}".`,
            type: "APPOINTMENT_UPDATE",
          },
        })
      );
    }

    await Promise.all(notifications);

    return updatedAppointment;
  } catch (error) {
    console.error("Error in changeAppointmentDoctorFromDB:", error);
    return null;
  }
};
