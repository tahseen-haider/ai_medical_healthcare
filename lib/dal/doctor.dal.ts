import "server-only";

import { eachDayOfInterval, format, subDays } from "date-fns";
import { prisma } from "../db/prisma";
import { AppointmentStatus, DoctorType } from "@prisma/client/edge";
import cloudinary from "../cloudinary";
import { DoctorRemark, UserType } from "../definitions";
import { revalidatePath } from "next/cache";

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
    console.error("Error in getDoctorsForLoadMoreFromDB:", error);
    return { doctors: [], totalPages: 0 };
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
    console.error("Error in getDoctorsForDoctorSectionFromDB:", error);
    return [];
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

    const { password, token, ...restUser } = user;
    return restUser;
  } catch (error) {
    console.error("Error in getDoctorFromDB:", error);
    return;
  }
};

export const getPatientProfileFromDB = async (
  userId: string
): Promise<UserType | undefined> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        appointmentsAsDoctor: true,
        appointmentsAsPatient: true,
      },
    });

    if (!user) return;

    const { password, token, ...restUser } = user;
    return restUser;
  } catch (error) {
    console.error("Error in getPatientProfileFromDB:", error);
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
    console.error("Error in getNewAppointmentsInfoFromDB:", error);
    return [];
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
          preferredDate: "asc",
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
    console.error("Error in getAllAppointmentsForDoctorFromDB:", error);
    return {
      appointments: [],
      count: 0,
      totalPages: 0,
    };
  }
};

export const getOutOfDateAppointmentsFromDB = async (
  page: number,
  limit: number,
  doctorId: string
) => {
  try {
    const now = new Date();

    const allAppointments = await prisma.appointments.findMany({
      where: {
        doctorId,
        status: {
          not: "CANCELLED",
        },
      },
      orderBy: {
        preferredDate: "asc",
      },
      skip: (page - 1) * limit,
      take: limit * 5,
      select: {
        id: true,
        fullname: true,
        email: true,
        preferredDate: true,
        preferredTime: true,
        reasonForVisit: true,
        doctorId: true,
        status: true,
        phone: true,
        doctor: {
          select: {
            name: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const outOfDateAppointments = allAppointments
      .map((appointment) => {
        try {
          const date = new Date(appointment.preferredDate);
          const [time, modifier] = appointment.preferredTime.split(" ");
          let [hours, minutes] = time.split(":").map(Number);
          if (modifier === "PM" && hours < 12) hours += 12;
          if (modifier === "AM" && hours === 12) hours = 0;
          date.setHours(hours, minutes, 0, 0);
          return { ...appointment, fullDateTime: date };
        } catch (innerError) {
          console.error(
            "Failed to parse appointment date/time:",
            appointment.id,
            innerError
          );
          return null;
        }
      })
      .filter(
        (
          appointment
        ): appointment is (typeof allAppointments)[0] & {
          fullDateTime: Date;
        } => appointment !== null && appointment.fullDateTime < now
      )
      .slice(0, limit);

    return {
      appointments: outOfDateAppointments,
      count: outOfDateAppointments.length,
      totalPages: Math.ceil(outOfDateAppointments.length / limit),
    };
  } catch (error) {
    console.error("Error in getOutOfDateAppointmentsFromDB:", error);
    return;
  }
};

export const getAllUpcomingAppointmentsForDoctorFromDB = async (
  page: number,
  limit: number,
  doctorId: string
) => {
  try {
    const now = new Date();

    const allAppointments = await prisma.appointments.findMany({
      where: {
        doctorId,
        status: {
          not: "CANCELLED",
        },
      },
      orderBy: {
        preferredDate: "asc",
      },
      skip: (page - 1) * limit,
      take: limit * 5,
      select: {
        id: true,
        fullname: true,
        email: true,
        preferredDate: true,
        preferredTime: true,
        reasonForVisit: true,
        doctorId: true,
        status: true,
        phone: true,
        doctor: {
          select: {
            id: true,
            name: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
        appointmentMessages: {
          select: {
            id: true,
            content: true,
            senderId: true,
            receiverId: true,
            appointmentId: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const upcomingAppointments = allAppointments
      .map((appointment) => {
        try {
          const date = new Date(appointment.preferredDate);
          const [time, modifier] = appointment.preferredTime.split(" ");
          let [hours, minutes] = time.split(":").map(Number);

          if (modifier === "PM" && hours < 12) hours += 12;
          if (modifier === "AM" && hours === 12) hours = 0;

          date.setHours(hours, minutes, 0, 0);

          return { ...appointment, fullDateTime: date };
        } catch (innerError) {
          console.error(
            "Failed to parse appointment:",
            appointment.id,
            innerError
          );
          return null;
        }
      })
      .filter(
        (
          appointment
        ): appointment is (typeof allAppointments)[0] & {
          fullDateTime: Date;
        } => appointment !== null && appointment.fullDateTime >= now
      )
      .slice(0, limit);

    return {
      appointments: upcomingAppointments,
      count: upcomingAppointments.length,
      totalPages: Math.ceil(upcomingAppointments.length / limit),
    };
  } catch (error) {
    console.error("Error in getAllUpcomingAppointmentsForDoctorFromDB:", error);
    return;
  }
};

export const getCancelledAppointmentsForDoctorFromDB = async (
  page: number,
  limit: number,
  doctorId: string
) => {
  try {
    const [appointments, count] = await Promise.all([
      prisma.appointments.findMany({
        where: {
          doctorId,
          status: "CANCELLED",
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          preferredDate: "asc",
        },
        select: {
          id: true,
          fullname: true,
          email: true,
          preferredDate: true,
          preferredTime: true,
          reasonForVisit: true,
          doctorId: true,
          status: true,
          phone: true,
          doctor: {
            select: {
              name: true,
            },
          },
          patient: {
            select: {
              id: true,
              name: true,
            },
          },
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
      appointments,
      count,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error("Error in getCancelledAppointmentsForDoctorFromDB:", error);
    return;
  }
};

const getStatusMessage = (
  status: AppointmentStatus,
  currentStatus: AppointmentStatus,
  doctorName: string,
  patientName: string,
  preferredDate: Date
): string => {
  switch (status) {
    case "PENDING":
      return `Doctor "${doctorName}" marked the appointment of "${patientName}" (scheduled for "${preferredDate.toLocaleDateString(
        "en-GB"
      )}") as pending. "${patientName}", please wait for further confirmation.`;

    case "CONFIRMED":
      return `Doctor "${doctorName}" confirmed the appointment of "${patientName}" scheduled for "${preferredDate.toLocaleDateString(
        "en-GB"
      )}". "${patientName}", please be on time.`;

    case "CANCELLED":
      return `Doctor "${doctorName}" cancelled the appointment of "${patientName}" which was scheduled for "${preferredDate.toLocaleDateString(
        "en-GB"
      )}". "${patientName}", you may book a new appointment if needed.`;

    case "COMPLETED":
      return `Doctor "${doctorName}" marked the appointment of "${patientName}" on "${preferredDate.toLocaleDateString(
        "en-GB"
      )}" as completed. "${patientName}", we hope you're doing well!`;

    case "RESCHEDULED":
      return `Doctor "${doctorName}" rescheduled the appointment of "${patientName}". The original date was "${preferredDate.toLocaleDateString(
        "en-GB"
      )}". "${patientName}", please check your updated appointment details.`;

    case "PAYMENT_PENDING":
      return `Doctor "${doctorName}" marked the appointment of "${patientName}" on "${preferredDate.toLocaleDateString(
        "en-GB"
      )}" as payment pending. "${patientName}", please complete the payment to proceed.`;

    default:
      return `Doctor "${doctorName}" changed the appointment status of "${patientName}" on "${preferredDate.toLocaleDateString(
        "en-GB"
      )}" from "${currentStatus}" to "${status}".`;
  }
};

export const changeAppointmentStatusFromDB = async (
  appointmentId: string,
  status: AppointmentStatus,
  currentStatus: AppointmentStatus
) => {
  try {
    let app;

    if (status === "COMPLETED") {
      app = await prisma.appointments.update({
        where: { id: appointmentId },
        data: {
          updatedAt: new Date(),
          status,
          patient: {
            update: {
              lastCheckUp: new Date(),
            },
          },
        },
      });
    } else if (status === "PAID") {
      app = await prisma.appointments.update({
        where: { id: appointmentId },
        data: {
          updatedAt: new Date(),
          is_paid: true,
          status,
        },
      });
    } else {
      app = await prisma.appointments.update({
        where: { id: appointmentId },
        data: {
          status,
          updatedAt: new Date(),
        },
      });
    }

    if (!app) {
      return;
    }

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

    // Notify patient
    await prisma.notification.create({
      data: {
        link: "/your-appointments",
        userId: app.patientId!,
        title: "Appointment Status Changed By Doctor",
        message,
        type: "APPOINTMENT_UPDATE",
        ...(status === "PAYMENT_PENDING" ? { link: "/your-appointments" } : {}),
      },
    });

    // Notify all admins
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

    return { success: true };
  } catch (error) {
    console.error("Failed to change appointment status:", error);
    return;
  }
};


export const getDoctorDashboardNumbersFromDB = async (doctorId: string) => {
  try {
    // group by status (one query)
    const counts = await prisma.appointments.groupBy({
      by: ["status"],
      where: { doctorId },
      _count: { status: true },
    });

    // convert into { STATUS: count }
    const statusCounts = counts.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    return {
      pending:
        (statusCounts["PENDING"] ?? 0) +
        (statusCounts["PAYMENT_PENDING"] ?? 0),

      confirmed:
        (statusCounts["PAID"] ?? 0) +
        (statusCounts["CONFIRMED"] ?? 0) +
        (statusCounts["RESCHEDULED"] ?? 0),

      cancelled: statusCounts["CANCELLED"] ?? 0,

      completed: statusCounts["COMPLETED"] ?? 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard numbers:", error);
    return {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    };
  }
};


export const getAllAppointmentsForDashboardDoctorFromDB = async (
  doctorId: string
) => {
  try {
    return await prisma.appointments.findMany({
      where: { doctorId },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching all doctor dashboard appointments:", error);
    return;
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
    console.error("Error fetching approved doctors:", error);
    return;
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

    // Optional: Safely delete old pfp from Cloudinary
    if (existingUser?.pfp && existingUser.pfp !== pfp) {
      try {
        await cloudinary.uploader.destroy(existingUser.pfp);
      } catch (cloudErr) {
        console.error(
          "Failed to delete old profile picture from Cloudinary:",
          cloudErr
        );
      }
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
    console.error("Error updating doctor profile:", error);
    return;
  }
};

export async function addDoctorRemarkInDB(
  patientId: string,
  doctorId: string,
  content: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!content.trim()) {
      return { success: false, error: "Remark content cannot be empty" }
    }

    await prisma.doctorRemark.create({
      data: {
        content: content.trim(),
        patientId,
        doctorId,
      },
    })

    revalidatePath(`/patient/${patientId}`)
    return { success: true }
  } catch (error) {
    console.error("Error adding doctor remark:", error)
    return { success: false, error: "Failed to add remark" }
  }
}

export async function getPatientRemarksInDB(patientId: string): Promise<DoctorRemark[]> {
  try {
    const remarks = await prisma.doctorRemark.findMany({
      where: {
        patientId,
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            pfp: true,
            doctorProfile: {
              select: {
                specialization: true,
                doctorType: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return remarks
  } catch (error) {
    console.error("Error fetching patient remarks:", error)
    return []
  }
}