import { getCurrentlyAuthenticatedUser } from "@/actions/auth.action";
import { getPfp } from "@/actions";
import UserProfile from "./components/UserProfile";
import AdminProfile from "./components/AdminProfile";
import DoctorProfile from "./components/DoctorProfile";

export default async function page() {
  const user = await getCurrentlyAuthenticatedUser();
  const pfp = await getPfp();

  return user.role === "admin" ? (
    <AdminProfile user={user} pfp={pfp}/>
  ) : user.role === "doctor" ? (
    <DoctorProfile user={user} pfp={pfp}/>
  ) : (
    <UserProfile user={user} pfp={pfp} />
  );
}
