import { redirect } from "next/navigation";

export default function DoctorRedirectPage() {
  redirect("/doctor/dashboard");
}