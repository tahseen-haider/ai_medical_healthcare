import FindUsHereSection from "@/components/FindUsHereSection";
import HeroSection from "@/components/homepage/Hero";
import OurDoctorsSection from "@/components/OurDoctorsSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import { isUserAuthenticated } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const session = await isUserAuthenticated(cookieStore.get("session")?.value);
  if (session?.role === "admin") {
    return redirect("/admin/dashboard");
  }
  if (session?.role === "doctor") {
    return redirect("/doctor/dashboard");
  }
  return (
    <main className="flex justify-center ">
      <div className="w-full flex flex-col items-center">
        {/* Hero Section */}
        <HeroSection />
        <div className="w-full border-b-[1px] " />
        {/* Our Doctors */}
        <OurDoctorsSection />
        <div className="w-full border-b-[1px] " />
        {/* Why Choose Us */}
        <WhyChooseUsSection />
        <div className="w-full border-b-[1px] " />
        {/* Our Services */}
        <ServicesSection />
        <div className="w-full border-b-[1px] " />
        {/* Contact Section */}
        <FindUsHereSection />
      </div>
    </main>
  );
}
