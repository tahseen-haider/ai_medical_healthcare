"use client";
import { contactUs } from "@/actions";
import Btn from "@/components/Button";
import FindUsHereSection from "@/components/FindUsHereSection";
import LoadingScreen from "@/components/LoadingScreen";
import PopUpCard from "@/components/PopUpCard";
import { useActionState, useEffect, useState } from "react";

export default function ContactUsPage() {
  const [state, action, pending] = useActionState(contactUs, undefined);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const responseSucess = state?.message;

    if (responseSucess) setSubmitted(true);
  }, [state]);
  return (
    <main className="flex flex-col items-center">
      <div className="max-w-[1920px] w-full">
        <section className="px-2 sm:px-6 py-10 flex items-center flex-col  gap-12 max-w-[1920px] w-full">
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
            className="lg:w-5/6 w-full rounded-lg shadow-light dark:shadow-dark py-16 px-5 lg:px-6 flex flex-col items-center gap-12 max-w-[1000px] dark:bg-dark-4"
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
                  className="input-field"
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
                  className="input-field"
                />
              </div>
            </div>
            <div className="w-full">
              <label
                htmlFor="inquiry"
                className="font-ubuntu font-bold text-lg"
              >
                Message
              </label>
              <textarea
                id="inquiry"
                name="inquiry"
                placeholder="Enter your message here"
                required
                className="block border-2 h-40 bg-gray-200 dark:bg-gray-950 border-gray-200 w-full p-4 rounded-sm mt-2 focus:bg-gray-100 dark:focus:bg-gray-800"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="px-6 py-3 bg-light-4 rounded-lg font-bold font-ubuntu text-2xl text-white shadow-light cursor-pointer hover:bg-black hover:text-white"
            >
              Submit
            </button>
          </form>

          {/* Loading while Uploading */}
          {pending && <LoadingScreen message={"Uploading Your Message..."} />}

          {/* Sucess Pop Up */}
          {submitted && (
            <PopUpCard>
              <h1 className="font-bold font-ubuntu text-2xl">
                {state?.message || "Submitted"}
              </h1>

              <div className="grid grid-cols-2 gap-y-3 text-base">
                <div className="font-semibold">Full Name:</div>
                <div>{state?.submitted?.fullname}</div>

                <div className="font-semibold">Email:</div>
                <div>{state?.submitted?.email}</div>

                <div className="font-semibold">Message:</div>
                <div className="w-[200px] h-[150px] overflow-auto">
                  {state?.submitted?.message}
                </div>
              </div>

              <Btn
                className="bg-light-4 dark:bg-dark-4 text-white w-2/4 text-lg"
                onClick={() => {
                  setSubmitted(false);
                }}
              >
                Close
              </Btn>
            </PopUpCard>
          )}
        </section>
        <FindUsHereSection />
      </div>
    </main>
  );
}
