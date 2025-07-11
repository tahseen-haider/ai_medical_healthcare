import FindUsHereSection from "@/components/FindUsHereSection";
import HeroSectionImproved from "@/components/Hero";
import HeroBtn from "@/components/homepage/HeroBtn";
import OurDoctorsSection from "@/components/OurDoctorsSection";
import ServicesSection from "@/components/ServicesSection";
import { Button } from "@/components/ui/button";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import { isUserAuthenticated } from "@/lib/session";
import { Separator } from "@radix-ui/react-select";
import { ArrowRight } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
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
        <HeroSectionImproved />
        <div className="w-full border-b-[1px] "/>
        {/* Our Doctors */}
        <OurDoctorsSection />
        <div className="w-full border-b-[1px] "/>
        {/* Why Choose Us */}
        <WhyChooseUsSection />
        <div className="w-full border-b-[1px] "/>
        {/* Our Services */}
        <ServicesSection />
        <div className="w-full border-b-[1px] "/>
        {/* Find Us */}
        <FindUsHereSection />
      </div>
    </main>
  );
}
