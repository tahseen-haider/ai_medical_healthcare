"use client";

import { SendForgotPasswordLinkToEmail } from "@/actions/auth.action";
import Btn from "@/components/Button";
import LoadingScreen from "@/components/LoadingScreen";
import { redirect } from "next/navigation";
import React, { useActionState } from "react";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState(
    SendForgotPasswordLinkToEmail,
    undefined
  );
  return (
    <main className="flex flex-col items-center">
      <section className="px-2 sm:px-6 py-4 flex items-center flex-col  gap-6 w-full max-w-[500px]">
        <div className="flex justify-between w-full gap-7">
          <div className="flex flex-col gap-3">
            <h1 className="font-ubuntu font-bold text-4xl text-dark-4 dark:text-white -tracking-[0.5px] ">
              Reset Password
            </h1>
            <h5 className="font-bold font-ubuntu text-base text-gray-600 dark:text-gray-400">
              Enter your email to send a verification link
            </h5>
          </div>
          <div className="flex flex-col gap-3 justify-between">
            <h5 className="font-bold font-ubuntu text-base text-gray-600 dark:text-gray-400">
              Back to login Page?
            </h5>
            <Btn
              onClick={(e) => {
                redirect("/login");
              }}
              className="bg-light-4 text-white font-bold font-ubuntu text-base p-3"
            >
              Log in
            </Btn>
          </div>
        </div>
        {/* Form */}
        <form
          action={action}
          className="w-full rounded-lg shadow-light dark:shadow-dark py-16 px-5 flex flex-col items-center gap-12 max-w-[1000px] dark:bg-dark-4"
        >
          <div className="flex flex-col gap-6 w-full">
            <div className=" w-full">
              <label htmlFor="email" className="font-ubuntu font-bold text-lg">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="example@mail.com"
                required
                className="input-field "
              />
            </div>
          </div>

          {/* Error message if any */}
          {state?.message && <p className="text-red-600">{state.message}</p>}

          <button
            type="submit"
            className="px-6 py-3 bg-light-4 rounded-lg font-bold font-ubuntu text-2xl text-white shadow-light cursor-pointer hover:bg-black hover:text-white"
          >
            Send Reset Link
          </button>
        </form>
        {/* Uploading */}
        {pending && <LoadingScreen message="Sending verification email" />}
      </section>
    </main>
  );
}
