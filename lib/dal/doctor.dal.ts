import "server-only";

import { eachDayOfInterval, format, subDays } from "date-fns";
import { prisma } from "../db/prisma";
import { AppointmentStatus, DoctorType } from "@prisma/client/edge";
import cloudinary from "../cloudinary";

export const getNewAppointmentsInfoFromDB = async (doctorId: string) => {
  try {
    const start = subDays(new Date(), 90);

    const users = await prisma.appointments.findMany({
      where: {
        doctorId,
        createdAt: {
          gte: start,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
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

    return final;
  } catch (error) {
    throw new Error(`Failed to get new appointments info: ${error}`);
  }
};

export const getAllAppointmentsForDoctorFromDB = async (
  page: number,
  limit: number,
  id: string
) => {
  try {
    const [appointments, count] = await Promise.all([
      prisma.appointments.findMany({
        where: {
          doctorId: id,
        },
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
          phone: true,
        },
      }),
      prisma.appointments.count({
        where: {
          doctorId: id,
        },
      }),
    ]);

    return {
      appointments,
      count,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw new Error(`Failed to get all appointments for doctor: ${error}`);
  }
};

export const changeAppointmentStatusFromDB = async (
  appointmentId: string,
  status: AppointmentStatus
) => {
  try {
    if (status === "COMPLETED") {
      await prisma.appointments.update({
        where: {
          id: appointmentId,
        },
        data: {
          patient: {
            update: {
              lastCheckUp: new Date(),
            },
          },
        },
      });
    }

    await prisma.appointments.update({
      where: {
        id: appointmentId,
      },
      data: {
        status,
      },
    });

    return;
  } catch (error) {
    throw new Error(`Failed to change appointment status: ${error}`);
  }
};

export const getDoctorDashboardNumbersFromDB = async (doctorId: string) => {
  try {
    const [pending, confirmed, completed, cancelled] = await Promise.all([
      prisma.appointments.count({
        where: {
          doctorId,
          status: "PENDING",
        },
      }),
      prisma.appointments.count({
        where: {
          doctorId,
          status: "CONFIRMED",
        },
      }),
      prisma.appointments.count({
        where: {
          doctorId,
          status: "COMPLETED",
        },
      }),
      prisma.appointments.count({
        where: {
          doctorId,
          status: "CANCELLED",
        },
      }),
    ]);

    return {
      pending,
      confirmed,
      completed,
      cancelled,
    };
  } catch (error) {
    throw new Error(`Failed to get doctor dashboard numbers: ${error}`);
  }
};

export const getAllAppointmentsForDashboardDoctorFromDB = async (
  doctorId: string
) => {
  try {
    return await prisma.appointments.findMany({
      where: {
        doctorId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    throw new Error(`Failed to get all dashboard appointments: ${error}`);
  }
};

export const getAllApprovedDoctorsFromDB = async () => {
  try {
    return await prisma.doctorProfile.findMany({
      where: {
        isApproved: true,
      },
      select: {
        doctorType: true,
        clinicName: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    throw new Error(`Failed to get approved doctors: ${error}`);
  }
};

export const updateDoctorProfileInDB = async (data: {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  pfp: string;
  doctorProfile: {
    doctorType: DoctorType;
    specialization: string;
    qualifications: string;
    experience: number;
    bio: string;
    clinicName: string;
    clinicAddress: string;
    consultationFee: number;
    availableDays: string[];
    availableTimes: string;
  };
}) => {
  try {
    const {
      id,
      name,
      email,
      phone,
      dob,
      gender,
      pfp,
      doctorProfile: {
        doctorType,
        specialization,
        qualifications,
        experience,
        bio,
        clinicAddress,
        clinicName,
        consultationFee,
        availableDays,
        availableTimes,
      },
    } = data;

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { pfp: true },
    });

    if (existingUser?.pfp && existingUser.pfp !== pfp) {
      await cloudinary.uploader.destroy(existingUser.pfp);
    }

    return await prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        phone,
        dob,
        gender,
        pfp,
        doctorProfile: {
          update: {
            doctorType,
            specialization,
            qualifications,
            experience,
            bio,
            clinicAddress,
            clinicName,
            consultationFee,
            availableDays,
            availableTimes,
          },
        },
      },
    });
  } catch (error) {
    throw new Error(`Failed to update doctor profile: ${error}`);
  }
};
