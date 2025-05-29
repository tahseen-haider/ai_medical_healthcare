import { z } from "zod";

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    // .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    // .regex(/[0-9]/, { message: "Contain at least one number." })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "Contain at least one special character.",
    // })
    .trim(),
});

export const AppointmentFormSchema = z.object({
  fullname: z
    .string()
    .min(2, { message: "Name must be least 2 characters" })
    .trim(),
  email: z.string().email({ message: "Please input a valid email" }),
  phone: z.string(),
  reasonForVisit: z.string(),
  preferredDate: z.string(),
  preferredTime: z.string(),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    // .min(8, { message: "Be at least 8 characters long" })
    // .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    // .regex(/[0-9]/, { message: "Contain at least one number." })
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: "Contain at least one special character.",
    // })
    .trim(),
});

export type AppointmentFormType =
  | {
      appointment?: {
        email: string;
        fullname: string;
        phone: string | null;
        reasonForVisit: string;
        preferredDate: string;
        preferredTime: string;
        id: string;
      };
      message?: string;
      errors: {
        general?: string[];
        fullname?: string[];
        email?: string[];
        phone?: string[];
        reasonForVisit?: string[];
        preferredDate?: string[];
        preferredTime?: string[];
      };
    }
  | undefined;

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: string;
  role: "admin" | "user";
  expiresAt: Date;
};

export type UserRole = "user" | "admin";
