"use server";

import { changeAppointmentStatusFromDB, getAllAppointmentsForDashboardDoctorFromDB, getAllAppointmentsForDoctorFromDB, getDoctorDashboardNumbersFromDB, getNewAppointmentsInfoFromDB } from "@/lib/dal/doctor.dal";
import { AppointmentStatus } from "@prisma/client/edge";
import { revalidatePath } from "next/cache";

export const getNewAppointmentsInfo = async () => {
  return await getNewAppointmentsInfoFromDB();
};

export const getAllAppointmentsForDoctor = async (page: number, limit: number, id:string) => {
  return await getAllAppointmentsForDoctorFromDB(page, limit, id);
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

  await changeAppointmentStatusFromDB(appointmentId, status);

  revalidatePath(`/admin/user-management?page=${currentPage}`);
  return {};
};

export const getDoctorDashboardNumbers = async (userId:string) => { 
  return await getDoctorDashboardNumbersFromDB(userId)
 }

 export const getAllAppointmentsForDashboardDoctor = async(userId:string)=>{
  return await getAllAppointmentsForDashboardDoctorFromDB(userId);
 }