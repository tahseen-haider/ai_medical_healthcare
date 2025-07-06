"use server";

import {
  addNewDoctorToDB,
  changeInquiryStatusFromDB,
  changeUserRoleFromDB,
  changeUserVerificationStatusFromDB,
  deleteAppointmentFromDB,
  deleteDoctorFromDB,
  deleteInquiryFromDB,
  deleteUserFromDB,
  getAdminDashboardNumbersFromDB,
  getAllAppointmentsFromDB,
  getAllDoctorsFromDB,
  getAllUsersFromDB,
  getAllVerifiedUsersFromDB,
  getAppointmentsFromDB,
  getInquiriesForPaginationFromDB,
  getInquiriesFromDB,
} from "@/lib/dal/admin.dal";
import { insertUserToDB } from "@/lib/dal/user.dal";
import { SignupFormSchema } from "@/lib/definitions";
import {
  GetAllUsersDTO,
  GetAllVerifiedUsersDTO,
  GetAppointmentsForDashboardDTO,
  GetInquiriesForDashboardDTO,
} from "@/lib/dto/admin.dto";
import { DoctorType, UserRole } from "@prisma/client/edge";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export const delayInMs = async (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const getAdminDashboardNumbers = async () => {
  return await getAdminDashboardNumbersFromDB();
};

export const getAllAppointments = async (page: number, limit: number) => {
  return await getAllAppointmentsFromDB(page, limit);
}

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
        doctorName: appointment.doctor?.name || "Unassigned",
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
      id: inquiry.id
    };
  });
};

export const getInquiriesForPagination = async (
  page: number,
  limit: number
): Promise<{
  inquiries: {
    email: string;
    is_read: boolean;
    id: string;
    createdAt: Date;
    fullname: string;
    inquiry: string;
  }[];
  count: number;
  totalPages: number;
}> => {
  const { inquiries, count } = await getInquiriesForPaginationFromDB(
    page,
    limit
  );

  return { inquiries, count, totalPages: Math.ceil(count / limit) };
};

export const getAllDoctors = async (page = 1, limit = 10) => {
  return await getAllDoctorsFromDB(page, limit);
};

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

export async function addNewUser(
  state: { message?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const userToken = await insertUserToDB(name, email, hashedPassword);

  if (!userToken) {
    return {
      message: "User with this email already exist.",
    };
  }

  revalidatePath(`/admin/user-management`);
  return { success: true };
}

export const deleteDoctor = async (
  state: { message: string; success?: boolean } | undefined,
  formData: FormData
) => {
  const userId = formData.get("doctorId") as string;
  const res = await deleteDoctorFromDB(userId);
  if (!res) return { message: "Error deleting", success: false };
  revalidatePath("/admin/doctors");
  return { message: "", success: true };
};

export const deleteInquiry = async (
  state: { message: string; success?: boolean } | undefined,
  formData: FormData
) => {
  const inquiryId = formData.get("inquiryId") as string;
  const page = formData.get("page") as string;
  const res = await deleteInquiryFromDB(inquiryId);
  if (!res) return { message: "Error deleting", success: false };
  revalidatePath(`/admin/inquiries/${page}`);
  return { message: "", success: true };
};

export const deleteAppointment = async (state: {} | undefined, formData: FormData) => {
  const appId = formData.get("appId") as string;
  const res = await deleteAppointmentFromDB(appId);
  if (!res) return;
  revalidatePath("/admin/appointments");
  return{}
}

export const deleteUser = async (state: {} | undefined, formData: FormData) => {
  const userId = formData.get("userId") as string;
  const res = await deleteUserFromDB(userId);
  if (!res) return;
  revalidatePath("/admin/user-management");
  return {};
};

export const changeUserRole = async (
  state: {} | undefined,
  formData: FormData
) => {
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as UserRole;
  const currentPage = formData.get("currentPage") as string;
  const currentRole = formData.get("currentRole") as UserRole;

  if (!userId || !role || currentRole === role) return;

  await changeUserRoleFromDB(userId, role, currentRole);

  revalidatePath(`/admin/user-management?page=${currentPage}`);
  return {};
};

export const changeUserVerificationStatus = async (
  state: {} | undefined,
  formData: FormData
) => {
  const userId = formData.get("userId") as string;
  const status = formData.get("status") as "0" | "1";
  const currentPage = formData.get("currentPage") as string;
  const currentStatus = formData.get("currentStatus") as "0" | "1";

  if (!userId || currentStatus === status) return;

  await changeUserVerificationStatusFromDB(userId, status);

  revalidatePath(`/admin/user-management?page=${currentPage}`);
  return {};
};

export const changeInquiryStatus = async (formData: FormData) => {
  const inquiryId = formData.get("inquiryId") as string;

  await changeInquiryStatusFromDB(inquiryId);
};
