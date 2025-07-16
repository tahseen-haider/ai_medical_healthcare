"use server";

import {
  AppointmentFormSchema,
  AppointmentFormType,
  ContactFormSchema,
  ContactFormState,
  NotificationItem,
  SaveProfileChangesState,
} from "@/lib/definitions";
import {
  deleteNotificationFromDB,
  getAppointmentMessagesCountFromDB,
  getAppointmentMessagesOfReceiverFromDB,
  getAppointmentMessagesOfSenderFromDB,
  getAuthUserWithAppointmentsFromDB,
  getTokensUsedFromDB,
  getUserNotificationsFromDB,
  markAllNotificationsAsReadInDB,
  markNotificationAsReadInDB,
  markNotificationAsUnreadInDB,
  sendAppointmentMessageToDB,
  setAppointmentToDB,
  uploadInquiry,
  uploadProfileChanges,
} from "@/lib/dal";
import cloudinary from "@/lib/cloudinary";
import {
  getUser,
  getUserCredentialsByEmail,
  updateUserProfileInDB,
} from "@/lib/dal/user.dal";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import { getUserIdnRoleIfAuthenticated } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { NotificationType } from "@prisma/client/edge";
import { ObjectId } from "bson";

export const contactUs = async (
  state: ContactFormState,
  formData: FormData
): Promise<ContactFormState> => {
  const validatedFields = ContactFormSchema.safeParse({
    fullname: formData.get("fullname"),
    email: formData.get("email"),
    inquiry: formData.get("inquiry"),
  });

  if (!validatedFields.success)
    return {
      is_submitted: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };

  try {
    const submitted = await uploadInquiry({
      ...validatedFields.data,
    });

    return {
      submitted: {
        fullname: submitted.fullname,
        email: submitted.email,
        message: submitted.inquiry,
      },
      is_submitted: true,
      message: "Message sent Sucessfully",
    };
  } catch {
    return { is_submitted: false, message: "Something went wrong" };
  }
};

export const setAppointment = async (
  state: AppointmentFormType,
  formData: FormData
): Promise<AppointmentFormType> => {
  try {
    const validatedFields = AppointmentFormSchema.safeParse({
      fullname: formData.get("fullname"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      reasonForVisit: formData.get("reasonForVisit"),
      preferredTime: formData.get("preferredTime"),
      preferredDate: formData.get("preferredDate"),
    });

    const patientId = formData.get("patientId") as string | undefined;
    const doctorId = formData.get("doctorId") as string;

    if (!validatedFields.success || !doctorId) {
      return;
    }

    const appointment = await setAppointmentToDB({
      ...validatedFields.data,
      patientId,
      doctorId,
    });

    if (!appointment) throw new Error("");

    return {
      appointment,
      message: "Appointment successfully scheduled.",
      errors: {},
    };
  } catch (err) {
    return {
      ...state,
      errors: { general: ["Something went wrong. Please try again."] },
    };
  }
};

export const saveProfileChanges = async (
  state: SaveProfileChangesState,
  formData: FormData
) => {
  const validatedFields = SaveProfileChangesState.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    dob: formData.get("dob"),
    gender: formData.get("gender"),
  });

  if (!validatedFields.success) return { message: "Inputs were invalid" };

  const { name, email, phone, dob, gender } = validatedFields.data;
  const user = await getUserCredentialsByEmail(email);
  if (!user) return { message: "Password is incorrect" };

  const file = formData.get("image") as File;
  let imageUploadUrl = "";

  if (file?.size) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    if (user.pfp) {
      await cloudinary.uploader.destroy(user.pfp);
    }

    const newPublicId = `profile_images/${user.id}-${uuidv4()}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "profile_images",
      public_id: newPublicId,
      overwrite: false,
    });

    if (uploadResult?.public_id) {
      imageUploadUrl = uploadResult.public_id;
    }
  }

  const changed = await uploadProfileChanges({
    name,
    email,
    phone,
    dob,
    gender,
    imageUploadUrl,
  });

  if (!changed) return { message: "Something went wrong." };

  return redirect("/profile");
};

export const getPfp = async () => {
  const session = await getUserIdnRoleIfAuthenticated();
  if (!session) return;

  const user = await getUser(session.userId);
  if (!user?.pfp) return;

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${user.pfp}`;
};

export async function updateUserProfile(_prevState: any, formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const dob = formData.get("dob") as string;
    const gender = formData.get("gender") as string;
    const pfp = formData.get("pfp") as string;
    const bloodType = formData.get("bloodType") as string;
    const allergies = JSON.parse(formData.get("allergies") as string);

    // New medical fields
    const chronicConditions = JSON.parse(
      formData.get("chronicConditions") as string
    );
    const medications = JSON.parse(formData.get("medications") as string);
    const surgeries = JSON.parse(formData.get("surgeries") as string);
    const immunizations = JSON.parse(formData.get("immunizations") as string);
    const bloodPressure = formData.get("bloodPressure") as string;
    const heartRate =
      Number.parseInt(formData.get("heartRate") as string) || null;
    const respiratoryRate =
      Number.parseInt(formData.get("respiratoryRate") as string) || null;
    const temperature =
      Number.parseFloat(formData.get("temperature") as string) || null;
    const height = Number.parseInt(formData.get("height") as string) || null;
    const weight = Number.parseInt(formData.get("weight") as string) || null;

    // Lifestyle factors
    const smokerValue = formData.get("smoker") as string;
    const smoker = smokerValue === "" ? null : smokerValue === "true";
    const alcoholUseValue = formData.get("alcoholUse") as string;
    const alcoholUse =
      alcoholUseValue === "" ? null : alcoholUseValue === "true";
    const exerciseFrequency = formData.get("exerciseFrequency") as string;
    const mentalHealthConcerns = JSON.parse(
      formData.get("mentalHealthConcerns") as string
    );
    const notes = formData.get("notes") as string;

    const updatedUser = {
      id,
      name,
      email,
      phone,
      dob,
      gender,
      pfp,
      bloodType,
      allergies,
      chronicConditions,
      medications,
      surgeries,
      immunizations,
      bloodPressure,
      heartRate,
      respiratoryRate,
      temperature,
      height,
      weight,
      smoker,
      alcoholUse,
      exerciseFrequency,
      mentalHealthConcerns,
      notes,
    };

    const res = await updateUserProfileInDB(updatedUser);
    if (!res) return { success: false };

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false };
  }
}

export async function getTokensUsed(userId: string) {
  return (await getTokensUsedFromDB(userId))?.ai_tokens_used;
}

export async function getUserNotifications(
  userId: string
): Promise<NotificationItem[]> {
  return getUserNotificationsFromDB(userId);
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<NotificationItem> {
  return markNotificationAsReadInDB(notificationId);
}
export async function markAllNotificationsAsRead(userId: string) {
  await markAllNotificationsAsReadInDB(userId);
}

export async function getAuthUserWithAppointments() {
  return getAuthUserWithAppointmentsFromDB();
}

export async function deleteNotification(id: string) {
  return await deleteNotificationFromDB(id);
}

export async function markNotificationAsUnread(id: string) {
  return await markNotificationAsUnreadInDB(id);
}

export async function sendAppointmentMessage({
  senderId,
  receiverId,
  content,
  appointmentId,
  title,
}: {
  title: string;
  senderId: string;
  receiverId: string;
  content: string;
  appointmentId: string;
}) {
  if (senderId === "" || receiverId === "") return;
  await sendAppointmentMessageToDB({
    senderId,
    receiverId,
    appointmentId,
    content,
    title,
  });
}

export async function getAppointmentMessagesCount(userId: string | undefined) {
  if (!userId) return;
  return await getAppointmentMessagesCountFromDB(userId);
}

export async function getAppointmentMessagesOfSenderReceiver(
  senderId: string | undefined,
  receiverId: string | undefined,
  appointmentId: string
) {
  const receivedMessages = await getAppointmentMessagesOfReceiver(
    receiverId,
    appointmentId
  );
  const sentMessages = await getAppointmentMessagesOfSender(
    senderId,
    appointmentId
  );

  return {
    receivedMessages, sentMessages
  }
}

export async function getAppointmentMessagesOfSender(
  userId: string | undefined,
  appointmentId: string
) {
  if (!userId) return;
  return await getAppointmentMessagesOfSenderFromDB(userId, appointmentId);
}

export async function getAppointmentMessagesOfReceiver(
  userId: string | undefined,
  appointmentId: string
) {
  if (!userId) return;
  return await getAppointmentMessagesOfReceiverFromDB(userId, appointmentId);
}
