"use client";
import { resetPassword } from "@/actions/auth.action";
import Btn from "@/components/Button";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useActionState } from "react";

export default function page({
  params,
}: {
  params: Promise<{ code: number }>;
}) {
  const resolvedParams = React.use(params);
  const emailnCode = resolvedParams.code;
  const email = emailnCode.toString().split("-")[0]
  const code = emailnCode.toString().split("-")[1]

  const [state, action, pending] = useActionState(resetPassword, undefined);

  return (
    <section className="px-6 py-10 flex items-center flex-col  gap-12 max-w-[1920px] w-full">
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-3">
          <h1 className="font-ubuntu font-bold text-4xl text-dark-4 dark:text-white -tracking-[0.5px] ">
            Enter Token For Verification
          </h1>
          <h5 className="font-bold font-ubuntu text-xl text-gray-600 dark:text-gray-400">
            Enter your token to verify your email
          </h5>
        </div>
        <div className="flex flex-col gap-3 justify-between">
          <h5 className="font-bold font-ubuntu text-xl text-gray-600 dark:text-gray-400">
            Password Not Resetting?
          </h5>
          <Btn
            onClick={(e) => {
              redirect("/reset-password");
            }}
            className="bg-light-4 text-white font-bold font-ubuntu text-xl p-6"
          >
            Send Email Link Again
          </Btn>
        </div>
      </div>
      {/* Form */}
      <form
        action={action}
        className="w-full md:w-5/6 rounded-4xl shadow-light dark:shadow-dark py-16 px-5 lg:px-6 flex flex-col items-center gap-12"
      >
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <input
            value={email}
            onChange={() => {}}
            id="email"
            type="number"
            name="email"
            hidden
          />
          <input
            value={code}
            onChange={() => {}}
            id="code"
            type="number"
            name="code"
            hidden
          />
          <div className="w-full lg:w-1/2">
            <label
              htmlFor="newPassword"
              className="font-ubuntu font-bold text-lg"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="********"
              required
              minLength={6}
              className="block border-2 border-gray-200 h-14 w-full p-4 rounded-2xl mt-2 "
            />
          </div>
          <div className="w-full lg:w-1/2">
            <label
              htmlFor="repeatNewPassword"
              className="font-ubuntu font-bold text-lg"
            >
              Repeat New Password
            </label>
            <input
              id="repeatNewPassword"
              type="password"
              name="repeatNewPassword"
              placeholder="********"
              required
              minLength={6}
              className="block border-2 border-gray-200 h-14 w-full p-4 rounded-2xl mt-2 "
            />
          </div>
        </div>
        {state?.message && <p className="text-red-600">{state.message}</p>}
        <button
          type="submit"
          className="px-6 py-3 bg-light-4 rounded-lg font-bold font-ubuntu text-2xl text-white shadow-light cursor-pointer hover:bg-black hover:text-white"
        >
          Reset Password
        </button>
      </form>

      {/* Uploading */}
      {pending && <LoadingScreen message="Sending verification email" />}
    </section>
  );
}
