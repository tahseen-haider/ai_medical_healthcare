"use client";
import { contactUs } from "@/actions";
import Btn from "@/components/Button";
import FindUsHereSection from "@/components/FindUsHereSection";
import LoadingScreen from "@/components/LoadingScreen";
import PopUpCard from "@/components/PopUpCard";
import { PhoneCallIcon } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

export default function ContactUsPage() {
  const [state, action, pending] = useActionState(contactUs, undefined);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (state?.is_submitted) {
      setShowPopup(true);
    }
  }, [state]);

  return (
    <main className="flex flex-col items-center">
      <section className="px-2 sm:px-6 py-4 flex items-center flex-col  gap-6 max-w-[500px] w-full">
        <div className="w-full text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <PhoneCallIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="font-ubuntu font-bold text-3xl text-dark-4 dark:text-white mb-2">
            Contact Us
          </h1>
          <p className="font-ubuntu text-lg text-gray-600 dark:text-gray-400">
            Have a question or suggestion? We're here to help.
          </p>
        </div>
        {/* Form */}
        <form
          action={action}
          className=" w-full rounded-lg shadow-light dark:shadow-dark py-16 px-5 flex flex-col items-center gap-12 max-w-[1000px] dark:bg-dark-4"
        >
          <div className="flex flex-col gap-6 w-full">
            <div className="w-full">
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
                minLength={3}
                className="input-field"
              />
            </div>
            <div className="w-full">
              <label htmlFor="email" className="font-ubuntu font-bold text-lg">
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
            <label htmlFor="inquiry" className="font-ubuntu font-bold text-lg">
              Message
            </label>
            <textarea
              id="inquiry"
              name="inquiry"
              placeholder="Enter your message here"
              required
              className="block border-[1px] h-40 bg-gray-200 dark:bg-gray-950 border-gray-200 w-full p-4 rounded-sm mt-2 focus:bg-gray-100 dark:focus:bg-gray-800"
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
        {state?.is_submitted && showPopup && (
          <PopUpCard setState={setShowPopup}>
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

            <Btn className=" w-2/4 text-lg" onClick={() => setShowPopup(false)}>
              Close
            </Btn>
          </PopUpCard>
        )}
      </section>
      {/* Find Us */}
      <div className="w-full max-w-[1920px]">
        <FindUsHereSection />
      </div>
    </main>
  );
}
