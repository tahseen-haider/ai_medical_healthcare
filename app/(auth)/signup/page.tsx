"use client";
import { signup } from "@/actions/auth.action";
import Btn from "@/components/Button";
import FindUsHereSection from "@/components/FindUsHereSection";
import LoadingScreen from "@/components/LoadingScreen";
import { signInWithOAuth } from "@/lib/oauth-client";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useActionState } from "react";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <main className="flex flex-col items-center">
      {/* Login Section */}
      <section className="px-2 sm:px-6 py-4 flex items-center flex-col  gap-6 w-full max-w-[500px]">
        <div className="flex justify-between gap-8 w-full">
          <div className="flex flex-col gap-3">
            <h1 className="font-ubuntu font-bold text-4xl text-dark-4 dark:text-white -tracking-[0.5px] ">
              Sign Up
            </h1>
            <h5 className="font-bold font-ubuntu text-base text-gray-600 dark:text-gray-400">
              Make an account to save your chats
            </h5>
          </div>
          <div className="flex flex-col gap-3 justify-between">
            <h5 className="font-bold font-ubuntu text-base text-gray-600 dark:text-gray-400">
              Already have an account?
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
        <div className="w-full rounded-lg shadow-light dark:shadow-dark py-16 px-5 flex flex-col items-center gap-12 max-w-[500px] dark:bg-dark-4">
          {/* OAuth */}
          <div className="w-full flex justify-between text-black font-bold">
            <button
              onClick={() => signInWithOAuth("google")}
              className="flex items-center w-1/2 justify-between mr-4 bg-light-4 dark:bg-white p-4 text-white dark:text-black rounded-lg shadow-dark dark:shadow-light"
            >
              Sign Up with Google
              <Image
                width={40}
                height={40}
                src="/icons/google-brands.svg"
                alt="google-logo"
              />
            </button>
            <button
              onClick={() => signInWithOAuth("github")}
              className="flex items-center w-1/2 justify-between mr-4 bg-light-4 dark:bg-white p-4 text-white dark:text-black rounded-lg shadow-dark dark:shadow-light"
            >
              Sign Up with GitHub
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
            <div className="flex flex-col gap-6 w-full">
              <div className="w-full">
                <label
                  htmlFor="username"
                  className="font-ubuntu font-bold text-lg"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="username"
                  name="username"
                  placeholder="John Doe"
                  required
                  className="input-field"
                />
              </div>
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
                  minLength={8}
                  maxLength={15}
                  className="input-field"
                />
              </div>
              {state?.errors?.password && (
                <div>
                  <p>Password must:</p>
                  <ul>
                    {state.errors.password.map((error) => (
                      <li key={error}>- {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-light-4 rounded-lg font-bold font-ubuntu text-2xl text-white shadow-light cursor-pointer hover:bg-black hover:text-white"
            >
              SignUp
            </button>
            {state?.message && <p className="text-red-600 text-center">{state.message}</p>}
            {(state?.errors?.email || state?.errors?.password) && (
              <p className="text-red-600 text-center">{state.errors.email}</p>
            )}
          </form>
        </div>
      </section>
      {/* Find Us */}
      <div className="w-full max-w-[1920px]">
        <FindUsHereSection />
      </div>
      {/* Uploading */}
      {pending && <LoadingScreen message="Signing you Up..." />}
    </main>
  );
}
