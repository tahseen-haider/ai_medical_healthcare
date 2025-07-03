"use client";
import { setAppointment } from "@/actions";
import Btn from "@/components/Button";
import FindUsHereSection from "@/components/FindUsHereSection";
import LoadingScreen from "@/components/LoadingScreen";
import PopUpCard from "@/components/PopUpCard";
import { DatePickerWithPresets } from "@/components/ui/DatePicker";
import { VisitReasonPicker } from "@/components/ui/ReasonForVisitPicker";
import { TimePicker } from "@/components/ui/TimePicker";
import { useActionState, useEffect, useState } from "react";

export default function AppointmentPage({patientId}:{patientId:string|undefined}) {
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
  const [doctorId, setDoctorId] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const responseSucess = state?.message;

    if (responseSucess) setSubmitted(true);
  }, [state]);

  return (
    <main className="flex flex-col items-center">
      <section className="px-2 sm:px-6 py-4 flex items-center flex-col  gap-6 max-w-[500px] w-full">
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-3">
            <h1 className="font-ubuntu font-bold text-4xl text-dark-4 dark:text-white -tracking-[0.5px]">
              Appointment
            </h1>
            <h5 className="font-bold font-ubuntu text-base text-gray-600 dark:text-gray-400">
              Arrange a meeting with a real doctor for checkup
            </h5>
          </div>
        </div>
        {/* Form */}
        <form
          action={action}
          className="w-full rounded-lg shadow-light dark:shadow-dark py-16 px-5 flex flex-col items-center gap-6 max-w-[500px] dark:bg-dark-4"
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
                minLength={2}
                className="input-field"
              />
              <p>{state?.errors.fullname}</p>
            </div>
            <div className=" w-full">
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
              <p>{state?.errors.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-6 w-full">
            <div className="w-full">
              <label htmlFor="phone" className="font-ubuntu font-bold text-lg">
                Phone{" "}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  (optional)
                </span>
              </label>
              <input
                id="phone"
                type="string"
                name="phone"
                placeholder="+92 000 0000000"
                inputMode="numeric"
                pattern="\d*"
                required
                minLength={10}
                maxLength={13}
                className="input-field"
              />
              <p>{state?.errors.phone}</p>
            </div>
            {/* Select Doctor */}
            <div className="w-full">
              <label className="font-ubuntu font-bold text-lg">
                Select a Doctor
              </label>

            </div>
            {/* Patient Id */}
            <input hidden readOnly value={patientId}/>
            <div className="w-full">
              <label className="font-ubuntu font-bold text-lg">
                Reason for Visit
              </label>
              <VisitReasonPicker setReason={setReason} />
              <input type="hidden" value={reason} name="reasonForVisit" />
              <p>{state?.errors.reasonForVisit}</p>
            </div>
          </div>
          <div className="flex flex-col gap-6 w-full">
            <div className="w-full">
              <label className="font-ubuntu font-bold text-lg">
                Preferred Date
              </label>
              <DatePickerWithPresets setSelectedDate={setSelectedDate} />
              <input
                type="hidden"
                name="preferredDate"
                value={
                  selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                }
              />
              <p>{state?.errors.preferredDate}</p>
            </div>
            <div className="w-full">
              <label className="font-ubuntu font-bold text-lg">
                Preferred Time
              </label>
              <TimePicker value={selectedTime} onChange={setSelectedTime} />
              <input
                type="hidden"
                name="preferredTime"
                value={
                  selectedTime
                    ? `${selectedTime.hour}: ${selectedTime.minute} ${selectedTime.ampm}`
                    : ""
                }
              />
              <p>{state?.errors.preferredTime}</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="px-6 py-2 mt-5 bg-light-4 dark:bg-dark-1 rounded-lg font-bold font-ubuntu text-2xl text-white shadow-light dark:shadow-dark cursor-pointer hover:bg-black hover:text-white"
          >
            Submit
          </button>
        </form>
        {/* Loading Screen for uploading */}
        {pending && (
          <LoadingScreen message={"Uploading Appointment Request..."} />
        )}
        {/* Sucess Pop Up */}
        {submitted && (
          <PopUpCard>
            <h1 className="font-bold font-ubuntu text-2xl">
              {state?.message || "Submitted"}
            </h1>

            <div className="grid grid-cols-2 gap-y-3 text-base">
              <div className="font-semibold">Full Name:</div>
              <div>{state?.appointment?.fullname}</div>

              <div className="font-semibold">Email:</div>
              <div>{state?.appointment?.email}</div>

              <div className="font-semibold">Phone:</div>
              <div>{state?.appointment?.phone || "N/A"}</div>

              <div className="font-semibold">Reason for Visit:</div>
              <div>{state?.appointment?.reasonForVisit}</div>

              <div className="font-semibold">Preferred Date:</div>
              <div>{state?.appointment?.preferredDate}</div>

              <div className="font-semibold">Preferred Time:</div>
              <div>{state?.appointment?.preferredTime}</div>

              <div className="font-semibold">Appointment ID:</div>
              <div>{state?.appointment?.id}</div>
            </div>

            <Btn
              className="bg-light-4 dark:bg-dark-4 text-white w-2/4 text-lg"
              onClick={() => {
                setSubmitted(false);
                window.location.reload();
              }}
            >
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
