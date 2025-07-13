"use client";

import { contactUs } from "@/actions";
import Btn from "@/components/Button";
import FindUsHereSection from "@/components/FindUsHereSection";
import LoadingScreen from "@/components/LoadingScreen";
import PopUpCard from "@/components/PopUpCard";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PhoneCallIcon, User, Mail, MessageSquare } from "lucide-react";
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
    <main className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-6xl px-2 md:px-4 py-2 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-2 md:mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <PhoneCallIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="font-ubuntu font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-1 md:mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question or suggestion? We're here to help and would love to
            hear from you.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-dark-4 rounded-2xl shadow-light dark:shadow-dark overflow-hidden">
            {/* Form Content */}
            <form action={action} className="p-8 space-y-10">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="font-ubuntu font-bold text-xl text-dark-4 dark:text-white">
                    Your Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label
                      htmlFor="fullname"
                      className="font-ubuntu font-bold text-sm text-dark-4 dark:text-white"
                    >
                      Full Name
                    </label>
                    <Input
                      id="fullname"
                      type="text"
                      name="fullname"
                      placeholder="Enter your full name"
                      required
                      minLength={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="email"
                      className="font-ubuntu font-bold text-sm text-dark-4 dark:text-white"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        className="pl-12"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="font-ubuntu font-bold text-xl text-dark-4 dark:text-white">
                    Your Message
                  </h3>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="inquiry"
                    className="font-ubuntu font-bold text-sm text-dark-4 dark:text-white"
                  >
                    Message
                  </label>
                  <Textarea
                    id="inquiry"
                    name="inquiry"
                    placeholder="Tell us how we can help you..."
                    required
                    rows={6}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full px-8 py-4 bg-light-4 dark:bg-dark-1 rounded-xl font-ubuntu font-bold text-xl text-white shadow-light dark:shadow-dark hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
                >
                  {pending ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <MessageSquare className="w-6 h-6" />
                      <span>Send Message</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Loading while Uploading */}
        {pending && <LoadingScreen message={"Uploading Your Message..."} />}

        {/* Success Pop Up */}
        {state?.is_submitted && showPopup && (
          <PopUpCard setState={setShowPopup}>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="font-ubuntu font-bold text-2xl text-dark-4 dark:text-white mb-2">
                {state?.message || "Message Sent Successfully!"}
              </h1>
              <p className="font-ubuntu text-gray-600 dark:text-gray-400">
                Thank you for reaching out. We'll get back to you as soon as
                possible.
              </p>
            </div>

            <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="font-ubuntu font-bold text-lg text-dark-4 dark:text-white mb-4">
                Message Summary
              </h3>
              <div className="space-y-4 font-ubuntu text-base">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    Full Name:
                  </span>
                  <span className="text-dark-4 dark:text-white">
                    {state?.submitted?.fullname}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    Email:
                  </span>
                  <span className="text-dark-4 dark:text-white">
                    {state?.submitted?.email}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    Message:
                  </span>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg max-h-32 overflow-y-auto text-dark-4 dark:text-white text-sm leading-relaxed">
                    {state?.submitted?.message}
                  </div>
                </div>
              </div>
            </div>

            <Btn className="w-full text-lg" onClick={() => setShowPopup(false)}>
              Close
            </Btn>
          </PopUpCard>
        )}
      </div>
      <Separator />
      {/* Find Us Section */}
      <div className="w-full max-w-[1920px]">
        <FindUsHereSection />
      </div>
    </main>
  );
}
