import React from "react";
import LearnMoreBtn from "./LearnMoreBtn";
import YouTubeEmbed from "./YouTubeEmbed";

export default function WhyChooseUsSection() {
  return (
    <section className="flex lg:flex-row flex-col justify-between items-center px-2 sm:px-6 py-10 sm:py-16 bg-light-4 dark:bg-dark-4 mb-1 ">
      <div className="w-full h-full pb-8 lg:pb-0 lg:w-1/2  flex flex-col justify-between">
        <h2 className="font-ubuntu font-bold text-2xl sm:text-4xl -tracking-[0.5px] text-white">
          Why Choose Us?
        </h2>
        <div className="my-4 pb-4 sm:my-12 flex flex-wrap justify-between gap-4">
          <h3 className="font-ubuntu font-bold text-lg sm:text-2xl text-black dark:text-white leading-7 tracking-tight">
            We Made Health Care Easy <br />
            for your family
          </h3>
          <p className="text-base text-gray-50 dark:text-white leading-[19px] tracking-tight pr-5">
            Our AI-powered medical assistant delivers fast, accurate health
            insights anytime you need them. From symptom checks to appointment
            booking and report analysis, we simplify your healthcare journey
            while keeping your data secure and private. Backed by real medical
            expertise, we offer 24/7 support you can trust <br />
            all in one easy-to-use platform.
          </p>
        </div>
        <LearnMoreBtn />
      </div>
      <div className="h-full w-full lg:w-1/2 flex items-center ">
        <YouTubeEmbed videoId="TfkHrvct1hg" />
      </div>
    </section>
  );
}
