"use client";
import { signup } from "@/actions/auth.action";
import Btn from "@/components/Button";
import FindUsHereSection from "@/components/FindUsHereSection";
import LoadingScreen from "@/components/LoadingScreen";
import { redirect } from "next/navigation";
import { useActionState } from "react";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <main className="bg-light-1 dark:bg-dark-4 flex flex-col items-center">
      {/* Login Section */}
      <section className="px-2 sm:px-6 py-10 flex items-center flex-col  gap-12 w-full max-w-[1920px]">
        <div className="flex justify-between gap-8 w-full">
          <div className="flex flex-col gap-3">
            <h1 className="font-ubuntu font-bold text-4xl text-dark-4 dark:text-white -tracking-[0.5px] ">
              Sign Up
            </h1>
            <h5 className="font-bold font-ubuntu text-base lg:text-xl text-gray-600 dark:text-gray-400">
              Make an account to save your chats
            </h5>
          </div>
          <div className="flex flex-col gap-3 justify-between">
            <h5 className="font-bold font-ubuntu text-base lg:text-xl text-gray-600 dark:text-gray-400">
              Already have an account?
            </h5>
            <Btn
              onClick={(e) => {
                redirect("/login");
              }}
              className="bg-light-4 text-white font-bold font-ubuntu text-base lg:text-xl p-3 lg:p-6"
            >
              Log in
            </Btn>
          </div>
        </div>
        {/* Form */}
        <form
          action={action}
          className="w-full lg:w-5/6 rounded-4xl shadow-light dark:shadow-dark py-16 px-5 lg:px-6 flex flex-col items-center gap-12"
        >
          <div className="flex lg:flex-row flex-col gap-6 w-full">
            <div className="w-full lg:w-1/3">
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
                className="block border-2 border-gray-200 h-14 w-full p-4 rounded-2xl mt-2 "
              />
            </div>
            <div className="w-full lg:w-1/3">
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
            {state?.errors?.email && <p>{state.errors.email}</p>}
            <div className="w-full lg:w-1/3">
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
                className="block border-2 border-gray-200 h-14 w-full p-4 rounded-2xl mt-2 "
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
          {state?.message && <p className="text-red-600">{state.message}</p>}
        </form>

        {(state?.errors?.email || state?.errors?.password) && (
          <p>{state.errors.email}</p>
        )}
        {state?.message && <p>{state.message}</p>}
      </section>
      {/* Find Us */}
      <div className="w-full max-w-[1920px]"><FindUsHereSection /></div>
      {/* Uploading */}
      {pending && <LoadingScreen message="Signing you Up..."/>}
    </main>
  );
}
