"use client";
import { sendVerifyEmail } from "@/actions/auth.action";
import LoadingScreen from "@/components/LoadingScreen";
import React, { useActionState } from "react";

export default function VerifyEmailPage() {
  const [state, action, pending] = useActionState(sendVerifyEmail, undefined);
  return (
    <main className=" flex flex-col items-center">
      <section className="px-2 sm:px-6 py-4 flex items-center flex-col  gap-6 max-w-[500px] w-full">
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-3">
            <h1 className="font-ubuntu font-bold text-4xl text-dark-4 dark:text-white -tracking-[0.5px] ">
              Email Verification
            </h1>
            <h5 className="font-bold font-ubuntu text-base text-gray-600 dark:text-gray-400">
              Enter your email and password to verify your email
            </h5>
          </div>
        </div>
        {/* Form */}
        <form
          action={action}
          className="w-full rounded-sm shadow-light dark:shadow-dark py-16 px-5 flex flex-col items-center gap-12 max-w-[1000px] dark:bg-dark-4"
        >
          <div className="flex flex-col gap-6 w-full">
            <div className="w-full">
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
            <div className="w-full">
              <label
                htmlFor="password"
                className="font-ubuntu font-bold text-lg"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                required
                minLength={6}
                className="input-field "
              />
            </div>
          </div>
          {state?.errors?.password && (
            <p className="text-red-600">{state.errors.password}</p>
          )}
          <button
            type="submit"
            className="px-6 py-3 bg-light-4 rounded-lg font-bold font-ubuntu text-2xl text-white shadow-light cursor-pointer hover:bg-black hover:text-white"
          >
            Verify
          </button>
          {state?.message && <p className="text-red-600">{state.message}</p>}
        </form>
        {/* Uploading */}
        {pending && <LoadingScreen message="Sending verification email" />}
      </section>
    </main>
  );
}
