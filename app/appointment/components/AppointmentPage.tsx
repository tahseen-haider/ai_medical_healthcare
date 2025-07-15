"use client";

import { setAppointment } from "@/actions";
import Btn from "@/components/Button";
import LoadingScreen from "@/components/LoadingScreen";
import PopUpCard from "@/components/PopUpCard";
import { DatePickerWithPresets } from "@/components/ui/DatePicker";
import { VisitReasonPicker } from "@/components/ui/ReasonForVisitPicker";
import { TimePicker } from "@/components/ui/TimePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, User, Mail, Phone, Clock, Stethoscope } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import SelectDoctor from "./SelectDoctor";
import type { $Enums } from "@prisma/client/edge";

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

  const [selectedTime, setSelectedTime] = useState({
    hour: "09",
    minute: "30",
    ampm: "AM" as "AM" | "PM",
  });
  const [reason, setReason] = useState("General Checkup");
  const [doctorId, setDoctorId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (state?.message) setSubmitted(true);
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

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-dark-4 rounded-2xl shadow-light dark:shadow-dark overflow-hidden">
            <form action={action} className="p-8 space-y-10">
              {/* Personal Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="font-ubuntu font-bold text-xl text-dark-4 dark:text-white">
                    Personal Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      name="fullname"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      minLength={2}
                    />
                    {state?.errors.fullname && (
                      <p className="text-sm text-red-500">
                        {state.errors.fullname}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-12"
                        required
                      />
                    </div>
                    {state?.errors.email && (
                      <p className="text-sm text-red-500">
                        {state.errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number{" "}
                    <span className="text-sm font-normal text-gray-500">
                      (optional)
                    </span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+92 000 0000000"
                      inputMode="numeric"
                      pattern="\d*"
                      minLength={10}
                      maxLength={13}
                      className="pl-12"
                    />
                  </div>
                  {state?.errors.phone && (
                    <p className="text-sm text-red-500">{state.errors.phone}</p>
                  )}
                </div>
              </section>

              {/* Appointment Info */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Stethoscope className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="font-ubuntu font-bold text-xl text-dark-4 dark:text-white">
                    Medical Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="selectDoctor">Select Doctor</Label>
                    <SelectDoctor setDoctorId={setDoctorId} doctors={doctors} />
                    <input name="doctorId" value={doctorId} hidden readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="selectReason">Reason for Visit</Label>
                    <VisitReasonPicker setReason={setReason} />
                    <input
                      name="reasonForVisit"
                      value={reason}
                      hidden
                      readOnly
                    />
                    {state?.errors.reasonForVisit && (
                      <p className="text-sm text-red-500">
                        {state.errors.reasonForVisit}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Schedule */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="font-ubuntu font-bold text-xl text-dark-4 dark:text-white">
                    Preferred Schedule
                  </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <DatePickerWithPresets
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                    />
                    <input
                      name="preferredDate"
                      hidden
                      readOnly
                      value={
                        selectedDate ? selectedDate.toLocaleDateString() : ""
                      }
                    />
                    {state?.errors.preferredDate && (
                      <p className="text-sm text-red-500">
                        {state.errors.preferredDate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">Preferred Time</Label>
                    <TimePicker
                      value={selectedTime}
                      onChange={setSelectedTime}
                    />
                    <input
                      name="preferredTime"
                      hidden
                      readOnly
                      value={`${selectedTime.hour}:${selectedTime.minute} ${selectedTime.ampm}`}
                    />
                    {state?.errors.preferredTime && (
                      <p className="text-sm text-red-500">
                        {state.errors.preferredTime}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Hidden patient ID */}
              <input name="patientId" value={patientId} hidden readOnly />

              {/* Submit Button */}
              <div className="mx-auto w-fit ">
                <button
                  type="submit"
                  disabled={pending}
                  className="w-fit mx-auto px-8 py-4 bg-light-4 dark:bg-dark-1 rounded-xl font-ubuntu font-bold text-xl text-white shadow-light dark:shadow-dark hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
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

        {/* Loading */}
        {pending && (
          <LoadingScreen message="Uploading Appointment Request..." />
        )}

        {/* Success PopUp */}
        {submitted && (
          <PopUpCard setState={setSubmitted}>
            <div className="text-center mb-6 p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="font-ubuntu font-bold text-2xl text-dark-4 dark:text-white mb-2">
                {state?.message || "Appointment Submitted Successfully!"}
              </h1>
              <p className="font-ubuntu text-gray-600 dark:text-gray-400">
                Thank you for your request. Our team will reach out shortly.
              </p>
            </div>
            <Btn onClick={() => setSubmitted(false)} className="w-full">
              Close
            </Btn>
          </PopUpCard>
        )}
      </div>
    </main>
  );
}
