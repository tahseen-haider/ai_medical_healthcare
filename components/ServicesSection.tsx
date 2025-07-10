import {
  BrainCircuit,
  ClipboardPlus,
  HeartPulse,
  Stethoscope,
  TimerReset,
} from "lucide-react";
import Link from "next/link";

const servicesList = [
  {
    icon: <Stethoscope size={32} />,
    title: "Medical Appointments",
    desc: "Book doctor visits fast with smart, hassle-free scheduling.",
    link: "/appointment",
  },
  {
    icon: <BrainCircuit size={32} />,
    title: "Ai Assistance",
    desc: "Get instant answers, symptom checks, and health tips from our smart AI.",
    link: "/assistant",
  },
  {
    icon: <ClipboardPlus size={32} />,
    title: "Medical-Report Analysis",
    desc: "Understand your medical reports with clear AI-powered summaries.",
    link: "/assistant",
  },
  {
    icon: <TimerReset size={32} />,
    title: "24/7 Support",
    desc: "Get health help anytime — our AI is always available.",
    link: "/assistant",
  },
];
export default function ServicesSection() {
  return (
    <section className="px-2 sm:px-6 py-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <HeartPulse className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="font-ubuntu font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-4">
          Our Services
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover a range of personalized medical services designed to support
          your health and well-being at every stage of life.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-between">
        {servicesList.map((ele) => (
          <div
            key={ele.title}
            className="h-60 sm:h-72 w-full md:w-1/2 lg:w-1/4 flex justify-center mb-6 sm:mb-12"
          >
            <Link
              href={ele.link}
              className="hover:-translate-y-0.5 group cursor-pointer flex flex-col gap-3 sm:gap-5 h-full w-[90%] lg:max-w-72 rounded-[35px] bg-light-1 dark:bg-dark-4 hover:bg-light-4 dark:hover:bg-dark-1 border-[1px] border-gray-300 dark:border-none dark:shadow-dark p-6 transition-all duration-300"
            >
              <div className="w-14 h-14 shadow-light rounded-lg bg-light-4 dark:bg-dark-3 text-white flex items-center justify-center  group-hover:text-white dark:group-hover:text-white group-hover:bg-gray-700">
                {ele.icon}
              </div>
              <h3 className="font-ubuntu font-bold text-xl sm:text-2xl tracking-tight dark:group-hover:text-white group-hover:text-light-1">
                {ele.title.split(" ")[0]} <br /> {ele.title.split(" ")[1]}
              </h3>
              <p className="tracking-tight text-base  leading-5 text-gray-600 dark:text-white dark:group-hover:text-white group-hover:text-light-1">
                {ele.desc}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
