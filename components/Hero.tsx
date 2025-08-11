import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Btn from "./Button"

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
      <div className="container mx-auto px-4 pt-2 lg:pt-6 pb-8 lg:py-12 h-full w-full max-w-[1440px] flex flex-col justify-between gap-20">
        {/* Hero Content */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-12 xl:gap-16 flex-1">
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
                <Btn className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-base sm:text-lg md:text-xl lg:text-2xl px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-5 xl:px-12 xl:py-6 h-10 sm:h-12 lg:h-14 xl:h-16 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 rounded-md">
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
          <div className="flex-1 w-full min-w-[280px] max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl flex items-center justify-center">
            <div className="w-full aspect-square rounded-2xl xl:rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="text-center space-y-4 lg:space-y-6 xl:space-y-8">
                {/* Responsive circle sizes - stays prominent */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-40 2xl:h-40 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 rounded-full bg-blue-500 shadow-lg"></div>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-600 dark:text-blue-400 font-medium text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                    AI Healthcare Assistant
                  </p>
                  <div className="flex justify-center space-x-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
