"use client";
import { contactUs } from "@/actions";
import FindUsHereSection from "@/components/FindUsHereSection";
import { DatePickerWithPresets } from "@/components/ui/DatePicker";
import { VisitReasonPicker } from "@/components/ui/ReasonForVisitPicker";
import { TimePicker } from "@/components/ui/TimePicker";
import { useActionState, useState } from "react";

export default function AppointmentPage() {
  const [state, action, pending] = useActionState(contactUs, undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<{
    hour: string;
    minute: string;
    ampm: "AM" | "PM";
  }>({
    hour: "09",
    minute: "30",
    ampm: "AM",
  });
  const [reason, setReason] = useState("General Checkup")
  console.log(reason)
  return (
    <main className="flex flex-col items-center">
      <div className="max-w-[1920px] w-full">
        <section className="px-6 py-10 flex items-center flex-col  gap-12 max-w-[1920px] w-full bg-light-2 dark:bg-dark-4">
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-3">
              <h1 className="font-ubuntu font-bold text-4xl text-dark-4 dark:text-white -tracking-[0.5px] ">
                Appointment
              </h1>
              <h5 className="font-bold font-ubuntu text-xl text-gray-600 dark:text-gray-400">
                Arrange a meeting with a real doctor for checkup
              </h5>
            </div>
          </div>
          {/* Form */}
          <form
            action={action}
            className="w-full lg:w-5/6 rounded-4xl shadow-light dark:shadow-dark py-16 px-5 lg:px-6 flex flex-col items-center gap-12 bg-white dark:bg-dark-4"
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
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              <div className="w-full lg:w-1/2">
                <label
                  htmlFor="phone"
                  className="font-ubuntu font-bold text-lg"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="number"
                  name="phone"
                  placeholder="+92 000 0000000"
                  required
                  minLength={10}
                  className="block border-2 border-gray-200 h-14 w-full p-4 rounded-2xl mt-2 "
                />
              </div>
              <div className="lg:w-1/2 w-full">
                <label
                  className="font-ubuntu font-bold text-lg"
                >
                  Reason for Visit
                </label>
                <VisitReasonPicker setReason={setReason}/>
                <input type="hidden" value={reason} name="reasonForVisit"/>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              <div className="w-full lg:w-1/2">
                <label
                  className="font-ubuntu font-bold text-lg"
                >
                  Pereferred Date
                </label>
                <DatePickerWithPresets setSelectedDate={setSelectedDate} />
                <input
                  type="hidden"
                  name="dateForVisit"
                  value={
                    selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                  }
                />
              </div>
              <div className="lg:w-1/2 w-full">
                <label
                  className="font-ubuntu font-bold text-lg"
                >
                  Preferred Time
                </label>
                <TimePicker value={selectedTime} onChange={setSelectedTime} />
                <input type="hidden" name="timeForVisit" value={selectedTime? `${selectedTime.hour}: ${selectedTime.minute} ${selectedTime.ampm}`: ""} />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2 mt-5 bg-light-4 dark:bg-dark-1 rounded-lg font-bold font-ubuntu text-2xl text-white shadow-light dark:shadow-dark cursor-pointer hover:bg-black hover:text-white"
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
