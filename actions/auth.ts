"use server";

import {
  getUserCredentialsByEmail,
  insertUserToDB,
  isUserVerified,
  verifyEmailfromDB,
} from "@/lib/dal/user.dal";
import {
  SignupFormSchema,
  SignUpFormState,
  LoginFormSchema,
  VerifyEmailFormState,
  LoginFormState,
  VerifyEmailFormSchema,
} from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function verifyEmail(
  state: VerifyEmailFormState,
  formData: FormData
): Promise<VerifyEmailFormState> {
  const validatedFields = VerifyEmailFormSchema.safeParse({
    email: formData.get("email"),
    verifyToken: formData.get("verifyToken"),
  });
  try {
    if (!validatedFields.success)
      return { errors: validatedFields.error.flatten().fieldErrors };

    const { email, verifyToken } = validatedFields.data;

    const verified = await verifyEmailfromDB({ email, verifyToken });

    if (verified) {
      await createSession(verified.id, verified.role);
      return { message: "Email verified Successfully!" };
    }

    return { errors: { verifyToken: ["Token is wrong"] } };
  } catch {
    return { errors: { verifyToken: ["Something went wrong"] } };
  }
}

export async function signup(state: SignUpFormState, formData: FormData) {
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

  const user = await insertUserToDB(name, email, hashedPassword);

  if (!user) {
    return {
      message: "An error occurred while creating your account.",
    };
  }

  return redirect("/verify-email");
}

export async function login(state: LoginFormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const user = await getUserCredentialsByEmail(email);

  if (!user) return { success: false, message: "Email is incorrect." };

  const isVerified = await isUserVerified(user.email);

  if(!isVerified) return { success: false, message: "Email is not verified." };

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched)
    return { success: false, message: "Email or password is incorrect" };

  await createSession(user.id, user.role);
  return redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
