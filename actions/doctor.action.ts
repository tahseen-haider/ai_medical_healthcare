"use server";

import {
  changeAppointmentStatusFromDB,
  getAllAppointmentsForDashboardDoctorFromDB,
  getAllUpcomingAppointmentsForDoctorFromDB,
  getCancelledAppointmentsForDoctorFromDB,
  getDoctorDashboardNumbersFromDB,
  getDoctorFromDB,
  getDoctorsForDoctorSectionFromDB,
  getDoctorsForLoadMoreFromDB,
  getNewAppointmentsInfoFromDB,
  getOutOfDateAppointmentsFromDB,
  updateDoctorProfileInDB,
} from "@/lib/dal/doctor.dal";
import { AppointmentStatus, DoctorType } from "@prisma/client/edge";
import { count } from "console";
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
  const res = await getAllUpcomingAppointmentsForDoctorFromDB(page, limit, id);

  if (!res)
    return {
      appointments: [],
      count: 0,
      totalPages: 0,
    };
  return {
    appointments: res.appointments,
    count: res.count,
    totalPages: res.totalPages,
  };
};

export const getOutOfDateAppointmentsForDoctor = async (
  page: number,
  limit: number,
  id: string
) => {
  const res = await getOutOfDateAppointmentsFromDB(page, limit, id);

  if (!res) return {
    appointments: [],
    count: 0,
    totalPages: 0,
  };;

  return {
    appointments: res.appointments,
    count: res.count,
    totalPages: Math.ceil(res.count / limit),
  };
};

export const getCancelledAppointmentsForDoctor = async (
  page: number,
  limit: number,
  id: string
) => {
  const res = await getCancelledAppointmentsForDoctorFromDB(page, limit, id);
  if (!res) return{
    appointment: [],
    count: 0,
    totalPages: 0
  };
  return {
    appointments: res.appointments,
    count: res.count,
    totalPages: Math.ceil(res.count / limit),
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
