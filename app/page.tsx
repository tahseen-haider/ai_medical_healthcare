import FindUsHereSection from "@/components/FindUsHereSection";
import HeroBtn from "@/components/homepage/HeroBtn";
import LoadingScreen from "@/components/LoadingScreen";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";

export default async function Home() {
  return (
    <main className="flex justify-center bg-light-1 dark:bg-dark-4">
      <div className="max-w-[1920px] w-full">
        {/* Hero Section */}
        <div className="flex flex-col sm:flex-row gap-10 justify-between px-6 py-24 h-fit bg-light-2 dark:bg-dark-4 bg-[url('../public/images/hero.png')]  bg-cover bg-center">
          <div className="">
          
            <h1 className="font-ubuntu font-bold -tracking-[0.5px] leading-[62px] text-5xl">
              Your 24/7 <br />
              AI-Powered <br />
              Healthcare Companion
            </h1>
            <h5 className="pt-4 font-ubuntu font-bold text-2xl -tracking-[0.5px] leading-[30px] text-white dark:text-gray-200">
              Get personalized health insights, symptom checks, and wellness
              support <br />
              anytime, anywhere.
            </h5>
          </div>

          <div className="flex items-end"><HeroBtn /></div>
        </div>
        {/* Our Services */}
        <ServicesSection/>
        {/* Why Choose Us */}
        <WhyChooseUsSection/>
        {/* Find Us */}
        <FindUsHereSection/>
      </div>
    </main>
  );
}
