import FindUsHereSection from "@/components/FindUsHereSection";
import HeroBtn from "@/components/homepage/HeroBtn";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import { isUserAuthenticated } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const role = await isUserAuthenticated(cookieStore.get("session")?.value);
  if (role === "admin") {
    return redirect("/admin/dashboard");
  }
  if (role === "doctor") {
    return redirect("/doctor/dashboard");
  }
  return (
    <main className="flex justify-center ">
      <div className="max-w-[1920px] w-full">
        {/* Hero Section */}
        <div className="flex flex-col sm:flex-row gap-10 justify-between px-2 sm:px-6 py-24 h-fit bg-gray-50 dark:bg-dark-4 bg-[url('../public/images/hero.png')]  bg-cover bg-center">
          <div className="">
            <h1 className="font-ubuntu font-bold -tracking-[0.5px] leading-10 sm:leading-[62px] text-3xl sm:text-5xl">
              Your 24/7 <br />
              AI-Powered <br />
              <span className="text-light-4 dark:text-light-3">
                Healthcare
              </span>{" "}
              Companion
            </h1>
            <h5 className="pt-4 font-ubuntu text-lg sm:text-2xl -tracking-[0.5px] leading-6 sm:leading-[30px] text-gray-700 dark:text-gray-200">
              Get personalized health insights, symptom checks, and wellness
              support <br />
              anytime, anywhere.
            </h5>
          </div>

          <div className="flex items-end">
            <HeroBtn />
          </div>
        </div>
        {/* Our Services */}
        <ServicesSection />
        {/* Why Choose Us */}
        <WhyChooseUsSection />
        {/* Find Us */}
        <FindUsHereSection />
      </div>
    </main>
  );
}
