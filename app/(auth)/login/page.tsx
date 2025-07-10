"use client";
import { login } from "@/actions/auth.action";
import Btn from "@/components/Button";
import FindUsHereSection from "@/components/FindUsHereSection";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useActionState } from "react";
import { signInWithOAuth } from "@/lib/oauth-client";
import Image from "next/image";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className=" flex flex-col items-center">
      {/* Uploading */}
      {pending && <LoadingScreen message="Logging In..." />}

      {/* Login Section */}
      <section className="px-2 sm:px-6 py-4 flex items-center flex-col  gap-6 max-w-[500px] w-full">
        <div className="flex justify-between w-full gap-5">
          <div className="flex flex-col gap-3">
            <h1 className="font-ubuntu font-bold text-4xl text-dark-4 dark:text-white -tracking-[0.5px] ">
              Login
            </h1>
            <h5 className="font-bold font-ubuntu text-base text-gray-600 dark:text-gray-400">
              Login to see your chats
            </h5>
          </div>
          <div className="flex flex-col gap-3 justify-between">
            <h5 className="font-bold font-ubuntu text-base text-gray-600 dark:text-gray-400">
              Don't have an account?
            </h5>
            <Btn
              onClick={(e) => {
                redirect("/signup");
              }}
              className="bg-light-4 text-white font-bold font-ubuntu text-base p-3"
            >
              Create an account
            </Btn>
          </div>
        </div>
        {/* Form */}
        <div className="w-full rounded-sm shadow-light dark:shadow-dark py-16 px-5 flex flex-col items-center gap-12 max-w-[500px] dark:bg-dark-4">
          {/* OAuth */}
          <div className="w-full flex justify-between text-black font-bold">
            <button
              onClick={() => signInWithOAuth("google")}
              className="flex items-center w-1/2 justify-between mr-4 bg-light-4 dark:bg-white p-4 text-white dark:text-black rounded-lg shadow-dark dark:shadow-light"
            >
              Sign in with Google{" "}
              <Image
                width={40}
                height={40}
                className=""
                src="/icons/google-brands.svg"
                alt="google-logo"
              />
            </button>
            <button
              onClick={() => signInWithOAuth("github")}
              className="flex items-center w-1/2 justify-between mr-4 bg-light-4 dark:bg-white p-4 text-white dark:text-black rounded-lg shadow-dark dark:shadow-light"
            >
              Sign in with GitHub
              <Image
                width={40}
                height={40}
                src="/icons/github-brands.svg"
                alt="github-logo"
              />
            </button>
          </div>
          {/* Separator */}
          <div className="w-full border-b-2 relative flex justify-center">
            <div className="absolute text-center -top-6 text-lg bg-gray-50 dark:bg-dark-4 p-3">
              OR
            </div>
          </div>
          {/* Custom Auth */}
          <form
            action={action}
            className="w-full flex flex-col items-center gap-6"
          >
            <div className="flex flex-col gap-4 w-full">
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="font-ubuntu font-bold text-lg"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="example@mail.com"
                  required
                  className="input-field"
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
                  minLength={8}
                  className="input-field"
                />
              </div>
            </div>
            {(state?.errors?.email || state?.errors?.password) && (
              <p className="text-red-600 text-center">{state.errors.email}</p>
            )}
            {state?.message && (
              <p className="text-red-600 text-center">{state.message}</p>
            )}
            <button
              type="submit"
              className="px-6 py-3 bg-light-4 rounded-lg font-bold font-ubuntu text-2xl text-white shadow-light cursor-pointer hover:bg-black hover:text-white"
            >
              Login
            </button>
            {/* Links */}
            <div className="max-w-[1000px flex flex-col gap-5 text-center justify-between font-bold text-white">
              <Link
                href="/reset-password"
                className="bg-light-4 py-1 px-3 shadow-light dark:shadow-dark rounded-lg"
              >
                Forgot Password?
              </Link>
              <Link
                href="/verify-email"
                className="bg-light-4 py-1 px-3 shadow-light dark:shadow-dark rounded-lg"
              >
                Verify your email address
              </Link>
            </div>
          </form>
        </div>
      </section>
      {/* Find Us */}
      <div className="w-full max-w-[1920px]">
        <FindUsHereSection />
      </div>
    </main>
  );
}
