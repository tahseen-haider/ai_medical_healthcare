"use client";
import { login } from "@/actions/auth.action";
import Btn from "@/components/Button";
import FindUsHereSection from "@/components/FindUsHereSection";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="bg-light-1 dark:bg-dark-4 flex flex-col items-center">
      
      {/* Uploading */}
      {pending && <LoadingScreen message="Logging In..."/>}

      {/* Login Section */}
      <section className="px-6 py-10 flex items-center flex-col  gap-12 max-w-[1920px] w-full">
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-3">
            <h1 className="font-ubuntu font-bold text-4xl text-dark-4 dark:text-white -tracking-[0.5px] ">
              Login
            </h1>
            <h5 className="font-bold font-ubuntu text-base lg:text-xl text-gray-600 dark:text-gray-400">
              Login to see your chats
            </h5>
          </div>
          <div className="flex flex-col gap-3 justify-between">
            <h5 className="font-bold font-ubuntu text-base lg:text-xl text-gray-600 dark:text-gray-400">
              Don't have an account?
            </h5>
            <Btn
              onClick={(e) => {
                redirect("/signup");
              }}
              className="bg-light-4 text-white font-bold font-ubuntu text-base lg:text-xl p-3 lg:p-6"
            >
              Create an account
            </Btn>
          </div>
        </div>
        {/* Form */}
        <form
          action={action}
          className="lg:w-5/6 w-full rounded-4xl shadow-light dark:shadow-dark py-16 px-5 lg:px-6 flex flex-col items-center gap-12"
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
                minLength={8}
                className="block border-2 border-gray-200 h-14 w-full p-4 rounded-2xl mt-2 "
              />
            </div>
          </div>
          {(state?.errors?.email || state?.errors?.password) && (
            <p className="text-red-600">{state.errors.email}</p>
          )}
          {state?.message && <p className="text-red-600">{state.message}</p>}
          <button
            type="submit"
            className="px-6 py-3 bg-light-4 rounded-lg font-bold font-ubuntu text-2xl text-white shadow-light cursor-pointer hover:bg-black hover:text-white"
          >
            Login
          </button>
        </form>
        {/* Links */}
        <div className="w-5/6 lg:w-4/6 flex lg:flex-row flex-col gap-5 text-center justify-between font-bold text-white">
          <Link href="/verify-email" className="bg-light-4 py-1 px-3 shadow-light dark:shadow-dark rounded-lg">Verify your email address</Link>
          <Link href="/reset-password" className="bg-light-4 py-1 px-3 shadow-light dark:shadow-dark rounded-lg">Forgot Password?</Link>
        </div>
      </section>
      {/* Find Us */}
      <div className="w-full max-w-[1920px]">
        <FindUsHereSection />
      </div>
    </main>
  );
}
