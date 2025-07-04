"use server";

import {
  addNewDoctorToDB,
  deleteDoctorFromDB,
  deleteUserFromDB,
  getAllDoctorsFromDB,
  getAllUsersFromDB,
  getAllVerifiedUsersFromDB,
  getAppointmentsFromDB,
  getInquiriesFromDB,
} from "@/lib/dal/admin.dal";
import {
  GetAllUsersDTO,
  GetAllVerifiedUsersDTO,
  GetAppointmentsForDashboardDTO,
  GetInquiriesForDashboardDTO,
} from "@/lib/dto/admin.dto";
import { DoctorType } from "@prisma/client/edge";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export const delayInMs = async (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const getAllUsers = async (page: number, limit: number) => {
  return await getAllUsersFromDB(page, limit);
};

export const getAllVerifiedUsers =
  async (): Promise<GetAllVerifiedUsersDTO> => {
    const users = await getAllVerifiedUsersFromDB();

    const usersToReturn = users.map((user) => {
      return {
        pfp: user.pfp,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toLocaleDateString().split("T")[0],
      };
    });

    await delayInMs(1000);

    return usersToReturn;
  };

export const getAppointments =
  async (): Promise<GetAppointmentsForDashboardDTO> => {
    const appointments = await getAppointmentsFromDB();
    if (!appointments) return [];
    await delayInMs(1000);
    return appointments.map((appointment) => {
      return {
        patientName: appointment.fullname,
        doctorName: appointment.doctor!.name,
        reasonForVisit: appointment.reasonForVisit,
        dateForVisit: appointment.preferredDate,
        status: appointment.status,
      };
    });
  };
export const getInquiries = async (): Promise<GetInquiriesForDashboardDTO> => {
  const inquiries = await getInquiriesFromDB();

  await delayInMs(1000);

  return inquiries.map((inquiry) => {
    return {
      name: inquiry.fullname,
      email: inquiry.email,
      message: inquiry.inquiry,
      is_read: inquiry.is_read,
    };
  });
};

export const getAllDoctors = async (page = 1, limit = 10) => {
  return await getAllDoctorsFromDB(page, limit);
};
``
export const addNewDoctor = async (
  state: { message: string; success?: boolean } | undefined,
  formData: FormData
) => {
  const name = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const hashedPassword = await bcrypt.hash(password, 10);
  const docType = formData.get("docType") as DoctorType;

  const newDoc = await addNewDoctorToDB(name, email, hashedPassword, docType);

  if (!newDoc) return { message: "Error while adding new Doctor." };
  if (newDoc === 2)
    return {
      message: "User already exists. Change his role in User management.",
    };

  revalidatePath("/admin/doctors");

  return { message: "", success: true };
};

export const deleteDoctor = async (
  state: { message: string; success?: boolean } | undefined,
  formData: FormData
) => {
  const doctorId = formData.get("doctorId") as string;
  const res = await deleteDoctorFromDB(doctorId);
  if (!res) return { message: "Error deleting", success: false };
  revalidatePath("/admin/doctors");
  return { message: "", success: true };
};

export const deleteUser = async (state:{}|undefined, formData:FormData) => {
  const userId = formData.get("userId") as string;
  const res = await deleteUserFromDB(userId)
  if(!res) return;
  revalidatePath("/admin/user-management")
  return {}
}