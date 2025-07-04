"use server";

import {
  deleteLoggedInUserFromDB,
  getUser,
  getUserCredentialsByEmail,
  insertUserToDB,
  isUserVerified,
  resetPasswordInDB,
  setUserToken,
  verifyEmailTokenfromDB,
  verifyToken,
  verifyUserCredentials,
} from "@/lib/dal/user.dal";
import {
  SignupFormSchema,
  SignUpFormState,
  LoginFormSchema,
  VerifyEmailFormState,
  LoginFormState,
  SendVerifyEmailFormSchema,
  VerifyEmailFormSchema,
  SendForgotPasswordLinkToEmailState,
  SendForgotPasswordLinkToEmailSchema,
  ResetPasswordFormState,
  ResetPasswordFormSchema,
} from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";

function sendCodeHTML(code: number) {
  return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Email Verification</title>
            <style>
              body {
                margin: 0; padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f6f9fc;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.05);
                padding: 40px;
              }
              h2 {
                color: #333;
                text-align: center;
              }
              p {
                font-size: 16px;
                color: #555;
                line-height: 1.5;
                text-align: center;
              }
              .code-box {
                text-align: center;
                margin: 30px 0;
              }
              .code {
                display: inline-block;
                background-color: #f1f5ff;
                padding: 15px 25px;
                font-size: 28px;
                letter-spacing: 8px;
                border-radius: 6px;
                font-weight: bold;
                color: #2a4eff;
              }
              .footer {
                font-size: 13px;
                color: #888;
                text-align: center;
                margin-top: 40px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Email Verification</h2>
              <p>Please use the following verification code to complete your sign-up process:</p>
              <div class="code-box">
                <span class="code">${code}</span>
              </div>
              <p>If you did not request this code, you can safely ignore this email.</p>
              <div class="footer">
                &copy; ${new Date().getFullYear()} MediTech. All rights reserved.
              </div>
            </div>
          </body>
        </html>
        `;
}

function sendResetLinkHTML(baseUrl: string, email: string, code: number) {
  const resetLink = `${baseUrl}/reset-password/${encodeURIComponent(
    email
  )}-${code}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Password Reset</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
        <div style="max-width: 600px; margin: 40px auto; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); padding: 40px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #555; line-height: 1.5; text-align: center;">
            Click the button below to reset your password. This link is valid for a limited time:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" target="_blank" style="
              background-color: #2a4eff;
              color: white;
              padding: 14px 28px;
              font-size: 16px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: bold;
              display: inline-block;
            ">Reset Password</a>
          </div>
          <p style="font-size: 16px; color: #555; line-height: 1.5; text-align: center;">
            If you did not request a password reset, you can safely ignore this email.
          </p>
          <div style="font-size: 13px; color: #888; text-align: center; margin-top: 40px;">
            &copy; ${new Date().getFullYear()} MediTech. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
}

type EmailRequest = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailRequest) {
  if (!process.env.EMAIL_ADMIN || !process.env.PASSWORD_ADMIN) {
    console.error("Missing email environment variables.");
    return undefined;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.PASSWORD_ADMIN,
      },
    });

    const mailOptions = {
      from: `"Tahsin Haider" <${process.env.EMAIL_ADMIN}>`,
      to,
      subject,
      html,
    };

    const response = await transporter.sendMail(mailOptions);
    return response;
  } catch (error) {
    console.error("Email sending failed:", error);
    return undefined;
  }
}

export async function sendVerifyEmail(
  state: VerifyEmailFormState,
  formData: FormData
): Promise<VerifyEmailFormState> {
  const validatedFields = SendVerifyEmailFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validatedFields.success)
    return { errors: validatedFields.error.flatten().fieldErrors };

  const { email, password } = validatedFields.data;

  const userExists = await verifyUserCredentials({ email, password });

  if (!userExists)
    return {
      message: "Incorrect email or password, Use right Password or Reset it",
    };

  const code = Math.floor(100000 + Math.random() * 900000);

  await setUserToken({ code, email });

  const res = await sendEmail({
    to: email,
    subject: "Email Verification for MediTech app",
    html: sendCodeHTML(code),
  });

  if (!res) return { message: "Error while sending the mail" };
  return redirect(`/verify-email/${encodeURIComponent(email)}`);
}

export async function SendForgotPasswordLinkToEmail(
  state: SendForgotPasswordLinkToEmailState,
  formData: FormData
) {
  const validatedFields = SendForgotPasswordLinkToEmailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) return { message: "Invalid email" };

  const { email } = validatedFields.data;

  try {
    const existingUser = await getUserCredentialsByEmail(email);
    if (!existingUser)
      return { message: "There is no account with this email" };

    const code = Math.floor(100000 + Math.random() * 900000);

    await setUserToken({ code, email });

    const res = await sendEmail({
      to: email,
      subject: "Reset Your MediTech Password",
      html: sendResetLinkHTML(process.env.BASE_URL!, email, code),
    });

    if (!res) return { message: "Failed to send Link" };
    return { message: "Link Sent! Check Your email" };
  } catch (error) {
    return { message: "There was an error." };
  }
}

export async function resetPassword(
  state: ResetPasswordFormState,
  formData: FormData
) {
  const validatedFields = ResetPasswordFormSchema.safeParse({
    email: formData.get("email"),
    code: Number(formData.get("code")),
    newPassword: formData.get("newPassword"),
    repeatNewPassword: formData.get("repeatNewPassword"),
  });

  if (!validatedFields.success) return { message: "Input a valid Password" };

  const { code, newPassword, repeatNewPassword } = validatedFields.data;
  const email = formData.get("email") as string;
  if (newPassword !== repeatNewPassword)
    return { message: "Passwords does not match" };

  const existingUser = await getUserCredentialsByEmail(email);
  if (!existingUser) return { message: "Email does not exist, Try Signing Up" };

  const codeMatches = await verifyToken(email, code);

  if (!codeMatches)
    return { message: "Token is incorrect, Please resend Reset Email" };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const res = await resetPasswordInDB({ email, newPassword: hashedPassword });

  if (!res) return { message: "Error while reseting password" };

  await deleteSession();

  redirect("/login");
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

  const userToken = await insertUserToDB(name, email, hashedPassword);

  if (!userToken) {
    return {
      message: "Email already used. Login or Reset Password from Login Page",
    };
  }

  const res = await sendEmail({
    to: email,
    subject: "Email Verification for MediTech app",
    html: sendCodeHTML(userToken),
  });

  if (!res) return { message: "Error while sending the mail" };
  redirect(`/verify-email/${encodeURIComponent(email)}`);
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

  if (!user || !user.password)
    return { success: false, message: "Email or Password is incorrect." };

  const isVerified = await isUserVerified(user.email);

  if (!isVerified) return { success: false, message: "Email is not verified." };

  const isPasswordMatched = await bcrypt.compare(password, user.password!);

  if (!isPasswordMatched)
    return { success: false, message: "Email or password is incorrect" };

  await createSession(user.id, user.role);
  return redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

export async function verifyEmail(
  state: VerifyEmailFormState,
  formData: FormData
) {
  const validatedFields = VerifyEmailFormSchema.safeParse({
    email: formData.get("email"),
    token: Number(formData.get("token")),
  });

  if (!validatedFields.success) return { message: "Enter a valid token" };

  const { email, token } = validatedFields.data;

  try {
    const res = await verifyEmailTokenfromDB({ email, verifyToken: token });

    if (!res) return { message: "Enter correct token" };

    await createSession(res.id, res.role);
  } catch (err) {
    console.error("Verification Error:", err);
    return { message: "Something went wrong during verification" };
  }
  redirect("/settings");
}

export async function getCurrentlyAuthenticatedUser() {
  const user = await getUser();
  if (!user) {
    await deleteSession();
    redirect("/login");
  }
  return user;
}

export async function deleteUserAccount(
  state: { message: string } | undefined,
  formData: FormData
) {
  const res = await deleteLoggedInUserFromDB();
  if (!res) {
    console.log("error")
    return { message: "Error while deleting account" };
  }
  return { message: "User Deleted" };
}
