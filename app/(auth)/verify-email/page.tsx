"use client";
import { sendVerifyEmail } from "@/actions/auth.action";
import LoadingScreen from "@/components/LoadingScreen";
import React, { useActionState } from "react";

export default function VerifyEmailPage() {
  const [state, action, pending] = useActionState(sendVerifyEmail, undefined);
  return (
    <section className="px-2 sm:px-6 py-10 flex items-center flex-col  gap-12 max-w-[1920px] w-full">
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-3">
          <h1 className="font-ubuntu font-bold text-4xl text-dark-4 dark:text-white -tracking-[0.5px] ">
            Email Verification
          </h1>
          <h5 className="font-bold font-ubuntu text-xl text-gray-600 dark:text-gray-400">
            Enter your email and password to verify your email
          </h5>
        </div>
      </div>
      {/* Form */}
      <form
        action={action}
        className="w-full md:w-5/6 rounded-4xl shadow-light dark:shadow-dark py-16 px-5 lg:px-6 flex flex-col items-center gap-12"
      >
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <div className="lg:w-1/2 w-full">
            <label htmlFor="email" className="font-ubuntu font-bold text-lg">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="example@mail.com"
              required
              className="block border-2 border-gray-200 h-14 w-full p-4 rounded-2xl mt-2 "
            />
          </div>
          <div className="w-full lg:w-1/2">
            <label htmlFor="password" className="font-ubuntu font-bold text-lg">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="********"
              required
              minLength={6}
              className="block border-2 border-gray-200 h-14 w-full p-4 rounded-2xl mt-2 "
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
        {state?.message && (
          <p className="text-red-600">{state.message}</p>
        )}
      </form>
      {/* Uploading */}
      {pending && <LoadingScreen message="Sending verification email" />}
    </section>
  );
}
