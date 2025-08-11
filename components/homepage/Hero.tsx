import "./styles/hero.css"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Btn from "../Button"
import Image from "next/image"

export default function HeroSection() {
  return (
    <div className="relative w-full min-h-screen pt-[65px] overflow-hidden">
      {/* Background */}
      <div
        className="absolute top-0 left-0 w-full h-[calc(100%+65px)] -z-10 transition-colors duration-500 
    bg-[linear-gradient(155deg,#fff_10%,#3CA4FF_50%)] 
    dark:bg-[linear-gradient(155deg,#000_0%,#061A31_40%)]"
      />
      {/* Main Content Container */}
      <div className="container mx-auto px-4 pt-2 lg:pt-6 pb-8 lg:py-12 h-full w-full max-w-[1440px] flex flex-col justify-center items-center gap-20">
        {/* Hero Content */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-12 xl:gap-16">
          {/* Text Content - Gets smaller on smaller screens, wraps properly */}
          <div className="lg:flex-1 text-center lg:text-left space-y-4 lg:space-y-6 xl:space-y-8">
            <h1 className="font-ubuntu font-bold -tracking-[0.5px] text-3xl md:text-4xl lg:text-5xl leading-tight">
              Your 24/7 <br className="hidden sm:block" />
              AI-Powered <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 to-black dark:from-blue-400 dark:to-white bg-clip-text text-transparent">
                Healthcare
              </span>{" "}
              Companion
            </h1>
            <h2 className="font-ubuntu text-base md:text-lg lg:text-xl -tracking-[0.5px] leading-relaxed text-gray-700 dark:text-gray-200 max-w-xl lg:max-w-2xl">
              Get personalized health insights, symptom checks, and wellness support anytime, anywhere.
            </h2>

            {/* CTA Section - Buttons scale down on smaller screens */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center lg:justify-start items-center pt-4 lg:pt-6">
              <Link href="/assistant">
                <Btn className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white dark:text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 xl:px-12 xl:py-6 h-10 sm:h-12 lg:h-14 xl:h-16 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 rounded-md">
                  Chat with AI NOW
                </Btn>
              </Link>

              <Link href="/appointment">
                <Button
                  variant="outline"
                  className="text-sm sm:text-base md:text-lg lg:text-xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 font-semibold px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 xl:px-12 xl:py-6 h-10 sm:h-12 lg:h-14 xl:h-16 transition-all duration-200 hover:shadow-lg hover:scale-105 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-md"
                >
                  Book Appointment
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Image/Graphic Placeholder - Stays large on all screens, prioritized */}
          <div className="w-full min-w-[280px] max-w-[400px] md:max-w-lg lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl flex items-center justify-center ">
            <div className="relative select-none pointer-events-none w-full flex items-center justify-center ">
              {/* Main Image */}
              <Image src="/images/Base.webp" width={2000} height={2000} alt="hero-graphics-main"/>
              {/* Extra Images */}
              <Image src="/images/Bot.webp" alt="bot-image" width={900} height={900} className="absolute -bottom-6 left-10 w-2/6"/>
              <Image src="/images/Drone.webp" alt="drone-image" width={900} height={900} className="absolute top-6 left-0 w-1/6 floating"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
