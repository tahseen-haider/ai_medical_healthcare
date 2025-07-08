"use server";

import {
  AppointmentFormSchema,
  AppointmentFormType,
  ContactFormSchema,
  ContactFormState,
  SaveProfileChangesState,
} from "@/lib/definitions";
import {
  setAppointmentToDB,
  uploadInquiry,
  uploadProfileChanges,
} from "@/lib/dal";
import cloudinary from "@/lib/cloudinary";
import { getUser, getUserCredentialsByEmail } from "@/lib/dal/user.dal";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import { getUserIdnRoleIfAuthenticated } from "@/lib/session";

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

  return redirect("/your-profile");
};

export const getPfp = async () => {
  const session = await getUserIdnRoleIfAuthenticated();
    if (!session) return;

  const user = await getUser(session.userId);
  if (!user?.pfp) return;

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${user.pfp}`;
};
