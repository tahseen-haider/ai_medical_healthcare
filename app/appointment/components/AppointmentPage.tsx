"use client";

import { setAppointment } from "@/actions";
import Btn from "@/components/Button";
import LoadingScreen from "@/components/LoadingScreen";
import PopUpCard from "@/components/PopUpCard";
import { DatePickerWithPresets } from "@/components/ui/DatePicker";
import { VisitReasonPicker } from "@/components/ui/ReasonForVisitPicker";
import { TimePicker } from "@/components/ui/TimePicker";
import { useActionState, useEffect, useState } from "react";
import SelectDoctor from "./SelectDoctor";
import type { $Enums } from "@prisma/client/edge";
import { Calendar, User, Mail, Phone, Clock, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AppointmentPage({
  patientId,
  doctors,
}: {
  doctors: {
    name: string;
    email: string;
    id: string;
    role: $Enums.UserRole;
    doctorProfile: {
      doctorType: $Enums.DoctorType;
    } | null;
    createdAt: Date;
    pfp: string | null;
  }[];
  patientId: string | undefined;
}) {
  const [state, action, pending] = useActionState(setAppointment, undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [selectedTime, setSelectedTime] = useState<{
    hour: string;
    minute: string;
    ampm: "AM" | "PM";
  }>({
    hour: "09",
    minute: "30",
    ampm: "AM",
  });
  const [reason, setReason] = useState("General Checkup");
  const [doctorId, setDoctorId] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const responseSucess = state?.message;
    if (responseSucess) setSubmitted(true);
  }, [state]);

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-6xl px-2 md:px-4 py-2 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-2 md:mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Stethoscope className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="font-ubuntu font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-1 md:mb-4">
            Book Your Appointment
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Schedule a consultation with our qualified healthcare professionals.
          </p>
        </div>

        {/* Main Form Container */}
        <div className="max-w-4xl mx-auto">
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
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label
                      htmlFor="fullname"
                      className="font-ubuntu font-bold text-lg text-dark-4 dark:text-white"
                    >
                      Full Name
                    </label>
                    <Input
                      id="fullname"
                      type="text"
                      name="fullname"
                      placeholder="Enter your full name"
                      required
                      minLength={2}
                    />
                    {state?.errors.fullname && (
                      <p className="font-ubuntu text-sm text-red-500 mt-1">
                        {state.errors.fullname}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="email"
                      className="font-ubuntu font-bold text-lg text-dark-4 dark:text-white"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="your.email@example.com"
                        required
                        className=" pl-12"
                      />
                    </div>
                    {state?.errors.email && (
                      <p className="font-ubuntu text-sm text-red-500 mt-1">
                        {state.errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="phone"
                    className="font-ubuntu font-bold text-lg text-dark-4 dark:text-white"
                  >
                    Phone Number{" "}
                    <span className="font-medium text-gray-500 dark:text-gray-400 text-base">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      name="phone"
                      placeholder="+92 000 0000000"
                      inputMode="numeric"
                      pattern="\d*"
                      minLength={10}
                      maxLength={13}
                      className="input-field pl-12"
                    />
                  </div>
                  {state?.errors.phone && (
                    <p className="font-ubuntu text-sm text-red-500 mt-1">
                      {state.errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Appointment Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Stethoscope className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="font-ubuntu font-bold text-xl text-dark-4 dark:text-white">
                    Medical Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label
                      htmlFor="selectDoctor"
                      className="font-ubuntu font-bold text-lg text-dark-4 dark:text-white"
                    >
                      Select Doctor
                    </label>
                    <SelectDoctor setDoctorId={setDoctorId} doctors={doctors} />
                    <input name="doctorId" hidden readOnly value={doctorId} />
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="selectReason"
                      className="font-ubuntu font-bold text-lg text-dark-4 dark:text-white"
                    >
                      Reason for Visit
                    </label>
                    <VisitReasonPicker setReason={setReason} />
                    <input readOnly type="hidden" value={reason} name="reasonForVisit" />
                    {state?.errors.reasonForVisit && (
                      <p className="font-ubuntu text-sm text-red-500 mt-1">
                        {state.errors.reasonForVisit}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="font-ubuntu font-bold text-xl text-dark-4 dark:text-white">
                    Preferred Schedule
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label
                      htmlFor="selectDate"
                      className="font-ubuntu font-bold text-lg text-dark-4 dark:text-white"
                    >
                      Preferred Date
                    </label>
                    <DatePickerWithPresets setSelectedDate={setSelectedDate} />
                    <input
                      readOnly
                      type="hidden"
                      name="preferredDate"
                      value={
                        selectedDate
                          ? selectedDate.toLocaleDateString().split("T")[0]
                          : ""
                      }
                    />
                    {state?.errors.preferredDate && (
                      <p className="font-ubuntu text-sm text-red-500 mt-1">
                        {state.errors.preferredDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="selectTime"
                      className="font-ubuntu font-bold text-lg text-dark-4 dark:text-white"
                    >
                      Preferred Time
                    </label>
                    <TimePicker
                      value={selectedTime}
                      onChange={setSelectedTime}
                    />
                    <input
                      readOnly
                      type="hidden"
                      name="preferredTime"
                      value={
                        selectedTime
                          ? `${selectedTime.hour}:${selectedTime.minute} ${selectedTime.ampm}`
                          : ""
                      }
                    />
                    {state?.errors.preferredTime && (
                      <p className="font-ubuntu text-sm text-red-500 mt-1">
                        {state.errors.preferredTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Hidden Fields */}
              <input name="patientId" hidden readOnly value={patientId} />

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
                      <span>Processing Request...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Calendar className="w-6 h-6" />
                      <span>Submit Appointment Request</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Loading Screen for uploading */}
        {pending && (
          <LoadingScreen message={"Uploading Appointment Request..."} />
        )}

        {/* Success Pop Up */}
        {submitted && (
          <PopUpCard>
            <div className="text-center mb-6 p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="font-ubuntu font-bold text-2xl text-dark-4 dark:text-white mb-2">
                {state?.message || "Appointment Submitted Successfully!"}
              </h1>
              <p className="font-ubuntu text-gray-600 dark:text-gray-400">
                Your appointment request has been received and will be processed
                shortly.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="font-ubuntu font-bold text-lg text-dark-4 dark:text-white mb-4">
                Appointment Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 font-ubuntu text-base">
                <div className="flex justify-between sm:col-span-1">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    Full Name:
                  </span>
                  <span className="text-dark-4 dark:text-white">
                    {state?.appointment?.fullname}
                  </span>
                </div>
                <div className="flex justify-between sm:col-span-1">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    Email:
                  </span>
                  <span className="text-dark-4 dark:text-white">
                    {state?.appointment?.email}
                  </span>
                </div>
                <div className="flex justify-between sm:col-span-1">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    Phone:
                  </span>
                  <span className="text-dark-4 dark:text-white">
                    {state?.appointment?.phone || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between sm:col-span-1">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    Reason for Visit:
                  </span>
                  <span className="text-dark-4 dark:text-white">
                    {state?.appointment?.reasonForVisit}
                  </span>
                </div>
                <div className="flex justify-between sm:col-span-1">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    Preferred Date:
                  </span>
                  <span className="text-dark-4 dark:text-white">
                    {state?.appointment?.preferredDate}
                  </span>
                </div>
                <div className="flex justify-between sm:col-span-1">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    Preferred Time:
                  </span>
                  <span className="text-dark-4 dark:text-white">
                    {state?.appointment?.preferredTime}
                  </span>
                </div>
                <div className="flex justify-between sm:col-span-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="font-semibold text-gray-600 dark:text-gray-400">
                    Appointment ID:
                  </span>
                  <span className="text-dark-4 dark:text-white font-mono text-sm">
                    {state?.appointment?.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Btn
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => {
                  setSubmitted(false);
                  window.location.reload();
                }}
              >
                Book Another
              </Btn>
              <Btn className="flex-1" onClick={() => setSubmitted(false)}>
                Close
              </Btn>
            </div>
          </PopUpCard>
        )}
      </div>
    </main>
  );
}
