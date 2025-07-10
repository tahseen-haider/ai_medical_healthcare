import { getCurrentlyAuthenticatedUser } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import AdminProfile from "./components/AdminProfile";
import DoctorProfile from "./components/DoctorProfile";
import UserProfile from "./components/UserProfile";

export default async function Page() {
  const user = await getCurrentlyAuthenticatedUser();
  if (!user) redirect("/");

  return user.role === "admin" ? (
    <AdminProfile user={user} />
  ) : user.role === "doctor" ? (
    <DoctorProfile user={user} />
  ) : (
    <UserProfile user={user} />
  );
}