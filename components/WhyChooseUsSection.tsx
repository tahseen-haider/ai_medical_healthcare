import React from "react";
import LearnMoreBtn from "./LearnMoreBtn";
import YouTubeEmbed from "./YouTubeEmbed";

export default function WhyChooseUsSection() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-dark-4 w-full py-12 sm:py-16 px-4 sm:px-8 lg:px-16">
  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
    {/* TEXT */}
    <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
      <h2 className="font-ubuntu font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight text-gray-900 dark:text-white">
        Why Choose Us?
      </h2>

      <h3 className="font-ubuntu font-semibold text-xl sm:text-2xl leading-snug text-primary dark:text-white">
        We Made Health Care Easy for Your Family
      </h3>

      <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-200">
        Our AI‑powered medical assistant delivers fast, accurate health insights anytime you need them. From symptom checks to appointment booking and report analysis, we simplify your healthcare journey while keeping your data secure and private.
        <br /><br />
        Backed by real medical expertise, we offer 24/7 support you can trust — all in one easy‑to‑use platform.
      </p>

      <LearnMoreBtn />
    </div>

    {/* VIDEO */}
    <div className="w-full lg:w-1/2">
      <div className="rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <YouTubeEmbed videoId="TfkHrvct1hg" />
      </div>
    </div>
  </div>
</section>
  );
}
