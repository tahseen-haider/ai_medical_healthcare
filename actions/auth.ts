"use server";

import { getUserCredentialsByEmail, insertUserToDB } from "@/lib/dal/user.dal";
import {
  SignupFormSchema,
  FormState,
  LoginFormSchema,
} from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
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

  await createSession(user.id, user.role);
  return redirect("/");
}

export async function login(state: FormState, formData: FormData) {
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
