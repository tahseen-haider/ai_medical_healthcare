import "server-only";

import { eachDayOfInterval, format, subDays } from "date-fns";
import { prisma } from "../db/prisma";
import { AppointmentStatus, DoctorType } from "@prisma/client/edge";
import cloudinary from "../cloudinary";
import { UserType } from "../definitions";

export async function getDoctorsForLoadMoreFromDB(page: number, limit: number) {
  try {
    const skip = (page - 1) * limit;
    const [doctors, totalDoctors] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        where: {
          role: "doctor",
          is_verified: true,
          doctorProfile: {
            isApproved: true,
          },
        },
        orderBy: {
          doctorProfile: {
            ratings: "desc",
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          pfp: true,
          createdAt: true,
          doctorProfile: {
            select: {
              doctorType: true,
              specialization: true,
              qualifications: true,
              experience: true,
              bio: true,
              clinicName: true,
              clinicAddress: true,
              consultationFee: true,
              availableDays: true,
              availableTimes: true,
              ratings: true,
              totalReviews: true,
              isApproved: true,
            },
          },
        },
      }),

      prisma.user.count({
        where: {
          role: "doctor",
          is_verified: true,
          doctorProfile: {
            isApproved: true,
          },
        },
      }),
    ]);

    return { doctors, totalPages: Math.ceil(totalDoctors / limit) };
  } catch (error) {
    console.error("Error fetching doctors from DB:", error);
    throw new Error("Failed to fetch doctors");
  }
}

export async function getDoctorsForDoctorSectionFromDB() {
  try {
    const doctors = await prisma.user.findMany({
      where: {
        role: "doctor",
        is_verified: true,
        doctorProfile: {
          isApproved: true,
        },
      },
      orderBy: {
        doctorProfile: {
          ratings: "desc",
        },
      },
      take: 4,
      select: {
        id: true,
        email: true,
        name: true,
        pfp: true,
        doctorProfile: {
          select: {
            doctorType: true,
            specialization: true,
            qualifications: true,
            experience: true,
            bio: true,
            clinicName: true,
            clinicAddress: true,
            consultationFee: true,
            availableDays: true,
            availableTimes: true,
            ratings: true,
            totalReviews: true,
            isApproved: true,
          },
        },
      },
    });

    return doctors;
  } catch (error) {
    console.error("Error fetching doctors for doctor section:", error);
    throw new Error("Failed to fetch doctors for doctor section");
  }
}

export const getDoctorFromDB = async (
  userId: string
): Promise<UserType | undefined> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        appointmentsAsDoctor: true,
        appointmentsAsPatient: true,
        doctorProfile: true,
      },
    });
    if (!user) return;

    const { password, token, ...restUser } = user || {};

    return restUser;
  } catch (error) {
    console.log(error);
    return;
  }
};

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

const getStatusMessage = (
  status: AppointmentStatus,
  currentStatus: AppointmentStatus,
  doctorName: string,
  patientName: string,
  preferredDate: string
): string => {
  switch (status) {
    case "PENDING":
      return `Doctor "${doctorName}" marked the appointment of "${patientName}" (scheduled for "${preferredDate}") as pending. "${patientName}", please wait for further confirmation.`;

    case "CONFIRMED":
      return `Doctor "${doctorName}" confirmed the appointment of "${patientName}" scheduled for "${preferredDate}". "${patientName}", please be on time.`;

    case "CANCELLED":
      return `Doctor "${doctorName}" cancelled the appointment of "${patientName}" which was scheduled for "${preferredDate}". "${patientName}", you may book a new appointment if needed.`;

    case "COMPLETED":
      return `Doctor "${doctorName}" marked the appointment of "${patientName}" on "${preferredDate}" as completed. "${patientName}", we hope you're doing well!`;

    case "RESCHEDULED":
      return `Doctor "${doctorName}" rescheduled the appointment of "${patientName}". The original date was "${preferredDate}". "${patientName}", please check your updated appointment details.`;

    case "PAYMENT_PENDING":
      return `Doctor "${doctorName}" marked the appointment of "${patientName}" on "${preferredDate}" as payment pending. "${patientName}", please complete the payment to proceed.`;

    default:
      return `Doctor "${doctorName}" changed the appointment status of "${patientName}" on "${preferredDate}" from "${currentStatus}" to "${status}".`;
  }
};

export const changeAppointmentStatusFromDB = async (
  appointmentId: string,
  status: AppointmentStatus,
  currentStatus: AppointmentStatus
) => {
  try {
    let app = undefined;

    if (status === "COMPLETED") {
      app = await prisma.appointments.update({
        where: { id: appointmentId },
        data: {
          patient: {
            update: {
              lastCheckUp: new Date(),
            },
          },
        },
      });
    } else {
      app = await prisma.appointments.update({
        where: { id: appointmentId },
        data: { status },
      });
    }

    if (app) {
      const admins = await prisma.user.findMany({
        where: { role: "admin" },
      });

      const doctor = app.doctorId
        ? await prisma.user.findUnique({ where: { id: app.doctorId } })
        : null;

      const doctorName = doctor?.name ?? "Unknown Doctor";

      const message = getStatusMessage(
        status,
        currentStatus,
        doctorName,
        app.fullname,
        app.preferredDate
      );

      // appointments for patient
      await prisma.notification.create({
        data: {
          userId: app.patientId!,
          title: "Appointment Status Changed By Doctor",
          message,
          type: "APPOINTMENT_UPDATE",
        },
      });

      // appointments for all admins
      await Promise.all(
        admins.map((admin) =>
          prisma.notification.create({
            data: {
              userId: admin.id,
              title: "Appointment Status Changed By Doctor",
              message,
              type: "APPOINTMENT_UPDATE",
            },
          })
        )
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to change appointment status:", error);
    throw new Error(`Failed to change appointment status`);
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
