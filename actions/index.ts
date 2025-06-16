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
import cloudinary from "@/lib";
import {
  getUser,
  getUserByEmailPassword,
  getUserCredentialsByEmail,
} from "@/lib/dal/user.dal";
import { getAuthenticateUserIdnRole } from "@/lib/session";

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
      errors: validatedFields.error.flatten().fieldErrors,
    };

  try {
    const submitted = await uploadInquiry({
      ...validatedFields.data,
    });

    return { message: "Message sent Sucessfully" };
  } catch {
    return { message: "Something went wrong" };
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

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const appointment = await setAppointmentToDB({
      ...validatedFields.data,
    });

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
    password: formData.get("password"),
  });

  if (!validatedFields.success) return { message: "Inputs were invalid" };

  const { name, email, phone, dob, gender, password } = validatedFields.data;
  const user = await getUserByEmailPassword(email, password);
  if (!user) return { message: "Password is incorrect" };

  const file = formData.get("image") as File;

  console.log("File:",file)
  
  let imageUploadUrl = "";
  if (file.size) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert to base64 for Cloudinary
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Delete previous image
    if (user.pfp) {
      await cloudinary.uploader.destroy(user.pfp);
    }
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "profile_images",
      public_id: user.id,
      overwrite: true,
    });

    if (uploadResult) imageUploadUrl = uploadResult.public_id;
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
  
  return { message: "Changes Saved" };
};

export const getPfp = async () => {
  const user = await getUser();
  return user?.pfp
};