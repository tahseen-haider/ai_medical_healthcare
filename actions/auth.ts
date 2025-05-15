"use server";

import { connectToDB } from "@/lib/db";
import { User } from "@/lib/db/models/userModel";
import {
  SignupFormSchema,
  FormState,
  LoginFormSchema,
} from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function signup(state: FormState, formData: FormData) {
  await connectToDB();

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

  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });

  const userData = await user.save();

  if (!userData) {
    return {
      message: "An error occurred while creating your account.",
    };
  }

  await createSession(userData._id.toString(), userData.role);
}

export async function login(state: FormState, formData: FormData) {
  await connectToDB();
  console.log('first')
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

  const user = await User.findOne({ email });

  if (!user)
    return { success: false, message: "Email or password is incorrect." };

  const isPasswordMatched = await bcrypt.compare(password, user?.password);

  if (!isPasswordMatched)
    return { success: false, messsage: "Email or password is incorrect" };

  await createSession(user._id.toString(), user.role)
}

export async function logout() {
  await deleteSession();
}
