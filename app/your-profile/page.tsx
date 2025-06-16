import { getCurrentlyAuthenticatedUser } from "@/actions/auth.action";
import ProfilePicture from "@/components/ProfilePicture";
import EditButton from "./components/editButton";

export default async function page() {
  const user = await getCurrentlyAuthenticatedUser();

  return (
    <section className="w-full flex flex-col md:flex-row p-6 gap-6">
      <div className="w-full md:w-1/3 border-2 p-4 flex flex-col items-center justify-center gap-3">
        <div>
          <ProfilePicture size={120}/>
        </div>
        <div className="w-full text-center">
          <h2 className="font-ubuntu font-bold text-2xl">{user?.name}</h2>
          <p className="text-gray-300">{user?.email}</p>
        </div>
        <EditButton/>
      </div>
      <div className="w-full md:w-2/3 border-2 p-4 flex flex-col gap-6 justify-center">
        <div className="grid grid-cols-2 gap-4">
          <h3>Full Name</h3>
          <p>{user?.name}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <h3>Email</h3>
          <p>{user?.email}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <h3>Phone</h3>
          <p>{user?.phone  || 'N/A'}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <h3>Date of birth</h3>
          <p>{user?.dob  || 'N/A'}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <h3>Gender</h3>
          <p>{user?.gender || 'N/A'}</p>
        </div>
      </div>
    </section>
  );
}
