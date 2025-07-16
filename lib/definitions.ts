import {
  $Enums,
  AppointmentMessage,
  AppointmentStatus,
  DoctorType,
  NotificationType,
} from "@prisma/client/edge";
import { number, z } from "zod";

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

export const SendVerifyEmailFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const AppointmentFormSchema = z.object({
  fullname: z
    .string()
    .min(2, { message: "Name must be least 2 characters" })
    .trim(),
  email: z.string().email({ message: "Please input a valid email" }),
  phone: z.string().optional(),
  reasonForVisit: z.string(),
  preferredDate: z.string(),
  preferredTime: z.string(),
});

export type UserType = {
  id: string;
  email: string;
  phone?: string | null;
  name: string;
  dob?: string | null;
  gender?: string | null;
  pfp?: string | null;
  createdAt: Date;
  role: UserRole;
  is_verified: boolean;
  ai_tokens_used?: number | null;
  bloodType?: string | null;
  allergies?: string[];
  chronicConditions?: string[] | null;
  medications?: string[];
  surgeries?: string[];
  immunizations?: string[];
  bloodPressure?: string | null;
  heartRate?: number | null;
  mentalHealthConcerns?: string[]; // default: []
  notes?: string | null;

  respiratoryRate?: number | null;
  temperature?: number | null;
  height?: number | null; // in cm or inches
  weight?: number | null; // in kg
  smoker?: boolean | null;
  alcoholUse?: boolean | null;
  exerciseFrequency?: string | null; // e.g., "Daily", "Weekly", "Rarely"

  // Preferences
  emailNotifications?: Boolean | null;
  smsReminders?: Boolean | null;
  twoFactorEnabled?: Boolean | null;
  lastLogin?: Date | null;
  lastCheckUp?: Date | null;

  // Included relations
  doctorProfile?: {
    id: string;
    userId: string;
    doctorType: DoctorType;
    specialization?: string | null;
    qualifications?: string | null;
    experience?: number | null;
    bio?: string | null;
    clinicName?: string | null;
    clinicAddress?: string | null;
    consultationFee?: number | null;
    availableDays: string[];
    availableTimes?: string | null;
    isApproved: boolean;
    ratings?: number | null;
    totalReviews?: number | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;

  appointmentsAsDoctor: {
    id: string;
    fullname: string;
    email: string;
    phone?: string | null;
    reasonForVisit: string;
    preferredDate: Date;
    preferredTime: string;
    status: AppointmentStatus;
    createdAt: Date;
    doctorId?: string | null;
    patientId?: string | null;
  }[];

  appointmentsAsPatient: {
    id: string;
    fullname: string;
    email: string;
    phone?: string | null;
    reasonForVisit: string;
    preferredDate: Date;
    preferredTime: string;
    status: AppointmentStatus;
    createdAt: Date;
    doctorId?: string | null;
    patientId?: string | null;
  }[];
};

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

export type AppointmentWithRelations = {
  id: string;
  fullname: string;
  email: string;
  phone: string | null;
  reasonForVisit: string;
  preferredDate: Date;
  preferredTime: string;
  status: AppointmentStatus;
  doctorId: string | null;
  doctor: {
    id: string;
    name: string;
  } | null;
  patient: {
    id: string;
    name: string;
  } | null;
  appointmentMessages: {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    appointmentId: string;
    createdAt: Date;
    sender: {
      id: string;
      // Add other user fields if needed
    };
    receiver: {
      id: string;
      // Add other user fields if needed
    };
  }[];
};

export const SendForgotPasswordLinkToEmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
});

export const VerifyEmailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  token: z.number(),
});

export const SaveProfileChangesState = z.object({
  email: z.string().email().trim(),
  name: z.string().trim(),
  phone: z.string().trim(),
  dob: z.string().trim(),
  gender: z.string().trim(),
});

// Chat Zod Validations

export const NewChatInputSchema = z.object({
  userPrompt: z.string(),
  imageData: z.string().optional(),
});

export const ChatInputSchema = z.object({
  userPrompt: z.string(),
  chatId: z.string(),
  imageData: z.string().optional(),
});

export const DeleteChatSchema = z.object({
  chatId: z.string(),
});

/////////////////////////////////////////////////////////

export type ContactFormType = {
  fullname: string;
  email: string;
  inquiry: string;
};
export const ContactFormSchema = z.object({
  fullname: z.string().trim(),
  email: z.string().email({ message: "Input a valid Email" }).trim(),
  inquiry: z.string().trim(),
});

export const ResetPasswordFormSchema = z.object({
  email: z.string(),
  code: z.number(),
  newPassword: z.string().trim(),
  repeatNewPassword: z.string().trim(),
});

export type ResetPasswordFormState =
  | {
      message?: string;
    }
  | undefined;

export type ContactFormState =
  | {
      message?: string;
      errors?: {
        fullname?: string[];
        email?: string[];
        message?: string[];
      };
      is_submitted: boolean;
      submitted?: {
        fullname: string;
        email: string;
        message: string;
      };
    }
  | undefined;

export type SaveProfileChangesState =
  | {
      message?: string;
    }
  | undefined;

export type AppointmentFormType =
  | {
      appointment?: {
        email: string;
        fullname: string;
        phone: string | null;
        reasonForVisit: string;
        preferredDate: Date;
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
        preferredDate?: Date[];
        preferredTime?: string[];
      };
    }
  | undefined;

export type VerifyEmailFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SignUpFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SendForgotPasswordLinkToEmailState =
  | {
      message?: string;
    }
  | undefined;
export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: string;
  role: UserRole;
  expiresAt: Date;
};

export type UserRole = "user" | "admin" | "doctor";

export type ChatState =
  | {
      message?: string;
    }
  | undefined;

export type NotificationItem = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string | null;
  relatedId?: string | null;
};
