"use client";
import { verifyEmail } from "@/actions/auth";
import React, { useActionState } from "react";

export default function VerifyEmailPage() {
  const [state, action, pending] = useActionState(verifyEmail, undefined);
  return (
    <section className="px-6 py-10 flex items-center flex-col  gap-12 max-w-[1920px] w-full">
      {/* Form */}
      <form
        action={action}
        className="w-5/6 rounded-4xl shadow-light dark:shadow-dark py-16 px-5 lg:px-6 flex flex-col items-center gap-12"
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
            <label
              htmlFor="verifyToken"
              className="font-ubuntu font-bold text-lg"
            >
              Token
            </label>
            <input
              id="verifyToken"
              type="number"
              name="verifyToken"
              placeholder="********"
              required
              minLength={6}
              maxLength={6}
              className="block border-2 border-gray-200 h-14 w-full p-4 rounded-2xl mt-2 "
            />
          </div>
        </div>
        {state?.errors?.verifyToken && (
          <p className="text-red-600">{state.errors.verifyToken}</p>
        )}
        {state?.message && <p className="text-red-600">{state.message}</p>}
        <button
          type="submit"
          className="px-6 py-3 bg-light-4 rounded-lg font-bold font-ubuntu text-2xl text-white shadow-light cursor-pointer hover:bg-black hover:text-white"
        >
          Verify
        </button>
      </form>
    </section>
  );
}
