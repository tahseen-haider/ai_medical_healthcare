"use server";

import { AppointmentFormSchema, AppointmentFormType } from "@/lib/definitions";
import { setAppointmentToDB } from "@/lib/dal";

export const contactUs = async (_: void, formData: FormData) => {};

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
      ...validatedFields.data
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
