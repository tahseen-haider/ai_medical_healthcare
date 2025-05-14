"use server";

import { connectToDB } from "@/db";
import { User } from "@/db/models/userModel";
import { SignupFormSchema, FormState } from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

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
    password: hashedPassword
  });

  const userData = await user.save();

  if (!userData) {
    return {
      message: "An error occurred while creating your account.",
    };
  }

  await createSession(userData._id.toString());

  redirect("/profile");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
