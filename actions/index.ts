"use server";

import {
  AppointmentFormSchema,
  AppointmentFormType,
  ContactFormSchema,
  ContactFormState,
} from "@/lib/definitions";
import { setAppointmentToDB, uploadMessage } from "@/lib/dal";

export const contactUs = async (
  state: ContactFormState,
  formData: FormData
): Promise<ContactFormState> => {
  const validatedFields = ContactFormSchema.safeParse({
    fullname: formData.get("fullname"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };

  try {
    const submitted = await uploadMessage({
      ...validatedFields.data,
    });

    return { message: "Message sent Sucessfully", submitted };
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
