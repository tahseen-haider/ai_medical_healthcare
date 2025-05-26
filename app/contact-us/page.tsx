"use client";
import { contactUs } from "@/actions";
import FindUsHereSection from "@/components/FindUsHereSection";
import { useActionState } from "react";

export default function ContactUsPage() {
  const [state, action, pending] = useActionState(contactUs, undefined);
  return (
    <main className="flex flex-col items-center">
      <div className="max-w-[1920px] w-full">
        <section className="px-6 py-10 flex items-center flex-col  gap-12 max-w-[1920px] w-full">
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-3">
              <h1 className="font-ubuntu font-bold text-4xl text-dark-4 dark:text-white -tracking-[0.5px] ">
                Contact Us
              </h1>
              <h5 className="font-bold font-ubuntu text-xl text-gray-600 dark:text-gray-400">
                Kindly reach us to get the fastest response and treatment
              </h5>
            </div>
          </div>
          {/* Form */}
          <form
            action={action}
            className="w-5/6 rounded-4xl shadow-light dark:shadow-dark py-16 px-5 lg:px-6 flex flex-col items-center gap-12"
          >
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              <div className="w-full lg:w-1/2">
                <label
                  htmlFor="fullname"
                  className="font-ubuntu font-bold text-lg"
                >
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="fullname"
                  name="fullname"
                  placeholder="John Doe"
                  required
                  minLength={8}
                  className="block border-2 border-gray-200 h-14 w-full p-4 rounded-2xl mt-2 "
                />
              </div>
              <div className="lg:w-1/2 w-full">
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
                  className="block border-2 border-gray-200 h-14 w-full p-4 rounded-2xl mt-2 "
                />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="message" className="font-ubuntu font-bold text-lg">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Enter your message here"
                required
                className="block border-2 h-40 border-gray-200 w-full p-4 rounded-2xl mt-2 "
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-light-4 rounded-lg font-bold font-ubuntu text-2xl text-white shadow-light cursor-pointer hover:bg-black hover:text-white"
            >
              Submit
            </button>
          </form>
        </section>
        <FindUsHereSection />
      </div>
    </main>
  );
}
