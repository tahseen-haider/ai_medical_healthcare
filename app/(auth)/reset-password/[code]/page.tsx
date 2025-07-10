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
  const emailEncoded = emailnCode.toString().split("-")[0];
  const code = emailnCode.toString().split("-")[1];
  const email = decodeURIComponent(emailEncoded);

  const [state, action, pending] = useActionState(resetPassword, undefined);

  return (
    <main className="flex flex-col items-center">
      <section className="px-6 py-4 flex items-center flex-col  gap-6 max-w-[500px] w-full">
        <div className="flex justify-between w-full gap-7">
          <div className="flex flex-col gap-3">
            <h1 className="font-ubuntu font-bold text-4xl text-dark-4 dark:text-white -tracking-[0.5px] ">
              Reset Password
            </h1>
            <h5 className="font-bold font-ubuntu text-base text-gray-600 dark:text-gray-400">
              Enter your token to verify your email
            </h5>
          </div>
          <div className="flex flex-col gap-3">
            <h5 className="font-bold font-ubuntu text-base text-gray-600 dark:text-gray-400">
              Password Not Resetting?
            </h5>
            <Btn
              onClick={(e) => {
                redirect("/reset-password");
              }}
              className="bg-light-4 text-white font-bold font-ubuntu text-base p-3"
            >
              Send Link Again
            </Btn>
          </div>
        </div>
        {/* Form */}
        <form
          action={action}
          className="w-full rounded-sm shadow-light dark:shadow-dark py-16 px-5 flex flex-col items-center gap-12 max-w-[1000px] dark:bg-dark-4"
        >
          <div className="flex flex-col gap-6 w-full">
            <input
              value={email}
              id="email"
              type="text"
              name="email"
              hidden
              readOnly
            />
            <input
              value={code}
              id="code"
              type="number"
              name="code"
              hidden
              readOnly
            />
            <div className="w-full">
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
                className="input-field"
              />
            </div>
            <div className="w-full">
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
                className="input-field"
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
        {pending && <LoadingScreen message="Resetting your Password..." />}
      </section>
    </main>
  );
}
