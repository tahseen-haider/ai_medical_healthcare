import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroBtn from "./homepage/HeroBtn";
import Btn from "./Button";

export default function HeroSectionMinimal() {
  return (
    <div className="flex flex-col sm:flex-row gap-10 justify-between px-2 sm:px-6 py-24 h-fit bg-gray-50 dark:bg-dark-4 bg-cover bg-center">
      <div className="">
        <h1 className="font-ubuntu font-bold -tracking-[0.5px] leading-10 sm:leading-[62px] text-3xl sm:text-5xl">
          Your 24/7 <br />
          AI-Powered <br />
          <span className="bg-gradient-to-r from-blue-600 to-black dark:from-dark-1 dark:to-white bg-clip-text text-transparent">
            Healthcare
          </span>{" "}
          Companion
        </h1>
        <h2 className="pt-4 font-ubuntu text-lg sm:text-2xl -tracking-[0.5px] leading-6 sm:leading-[30px] text-gray-700 dark:text-gray-200">
          Get personalized health insights, symptom checks, and wellness support{" "}
          <br />
          anytime, anywhere.
        </h2>
      </div>

      <div className="flex items-end">
        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <Link href="/assistant">
            <Btn className="bg-light-4 dark:bg-dark-1 dark:text-white text-white hover:text-white font-bold text-3xl px-6 py-8">
              Chat with Ai NOW
            </Btn>
          </Link>

          <Link href="/appointment" className="h-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full text-2xl sm:w-auto border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 font-semibold px-8 py-6 transition-all duration-200 hover:shadow-lg bg-gray-50"
            >
              Book Appointment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
