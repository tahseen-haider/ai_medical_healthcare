"use server";

import {
  changeAppointmentStatusFromDB,
  getAllAppointmentsForDashboardDoctorFromDB,
  getAllAppointmentsForDoctorFromDB,
  getDoctorDashboardNumbersFromDB,
  getDoctorFromDB,
  getDoctorsForDoctorSectionFromDB,
  getDoctorsForLoadMoreFromDB,
  getNewAppointmentsInfoFromDB,
  updateDoctorProfileInDB,
} from "@/lib/dal/doctor.dal";
import { AppointmentStatus, DoctorType } from "@prisma/client/edge";
import { revalidatePath } from "next/cache";

export const getNewAppointmentsInfo = async (doctorId: string) => {
  return await getNewAppointmentsInfoFromDB(doctorId);
};

export async function getDoctorsForDoctorSection() {
  return await getDoctorsForDoctorSectionFromDB();
}

export async function getDoctor(doctorId: string) {
  return await getDoctorFromDB(doctorId);
}

export async function getDoctorsForLoadMore(page: number, limit: number) {
  return await getDoctorsForLoadMoreFromDB(page, limit);
}

export const getAllUpcomingAppointmentsForDoctor = async (
  page: number,
  limit: number,
  id: string
) => {
  const res = await getAllAppointmentsForDoctorFromDB(page, limit, id);
  const now = new Date();

  const outOfDateAppointments = res.appointments.filter((appointment) => {
    const date = new Date(appointment.preferredDate); // e.g. "2025-07-15"

    // Parse time (e.g. "09:30 AM")
    const [time, modifier] = appointment.preferredTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert to 24-hour format
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    // Set time on the date object
    date.setHours(hours, minutes, 0, 0);

    // Compare full datetime to now
    return date < now && appointment.status !== "CANCELLED";
  });

  return {
    appointments: outOfDateAppointments,
    count: outOfDateAppointments.length,
    totalPages: Math.ceil(outOfDateAppointments.length / limit),
  };
};

export const getOutOfDateAppointmentsForDoctor = async (
  page: number,
  limit: number,
  id: string
) => {
  const res = await getAllAppointmentsForDoctorFromDB(page, limit, id);
  const now = new Date();

  const outOfDateAppointments = res.appointments.filter((appointment) => {
    const date = new Date(appointment.preferredDate); // e.g. "2025-07-15"

    // Parse time (e.g. "09:30 AM")
    const [time, modifier] = appointment.preferredTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert to 24-hour format
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    // Set time on the date object
    date.setHours(hours, minutes, 0, 0);

    // Compare full datetime to now
    return date < now && appointment.status !== "CANCELLED";
  });

  return {
    appointments: outOfDateAppointments,
    count: outOfDateAppointments.length,
    totalPages: Math.ceil(outOfDateAppointments.length / limit),
  };
};

export const getCancelledAppointmentsForDoctor = async (
  page: number,
  limit: number,
  id: string
) => {
  const res = await getAllAppointmentsForDoctorFromDB(page, limit, id);
  const now = new Date();

  const outOfDateAppointments = res.appointments.filter((appointment) => {
    return appointment.status === "CANCELLED";
  });

  return {
    appointments: outOfDateAppointments,
    count: outOfDateAppointments.length,
    totalPages: Math.ceil(outOfDateAppointments.length / limit),
  };
};

export const changeAppointmentStatus = async (
  state: {} | undefined,
  formData: FormData
) => {
  const appointmentId = formData.get("appointmentId") as string;
  const status = formData.get("status") as AppointmentStatus;
  const currentPage = formData.get("currentPage") as string;
  const currentStatus = formData.get("currentStatus") as AppointmentStatus;

  if (!appointmentId || !status || currentStatus === status) return;

  await changeAppointmentStatusFromDB(appointmentId, status, currentStatus);

  revalidatePath(`/admin/user-management?page=${currentPage}`);
  return {};
};

export const getDoctorDashboardNumbers = async (userId: string) => {
  return await getDoctorDashboardNumbersFromDB(userId);
};

export const getAllAppointmentsForDashboardDoctor = async (userId: string) => {
  return await getAllAppointmentsForDashboardDoctorFromDB(userId);
};

export async function updateDoctorProfile(_prevState: any, formData: FormData) {
  const updatedUser = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    dob: formData.get("dob") as string,
    gender: formData.get("gender") as string,
    pfp: formData.get("pfp") as string,
    doctorProfile: {
      doctorType: formData.get("doctorType") as DoctorType,
      specialization: formData.get("specialization") as string,
      qualifications: formData.get("qualifications") as string,
      experience: Number(formData.get("experience")),
      bio: formData.get("bio") as string,
      clinicName: formData.get("clinicName") as string,
      clinicAddress: formData.get("clinicAddress") as string,
      consultationFee: Number(formData.get("consultationFee")),
      availableDays: JSON.parse(formData.get("availableDays") as string),
      availableTimes: formData.get("availableTimes") as string,
    },
  };

  const res = await updateDoctorProfileInDB(updatedUser);
  if (!res) return { success: false };

  revalidatePath("/profile");
  return { success: true };
}
