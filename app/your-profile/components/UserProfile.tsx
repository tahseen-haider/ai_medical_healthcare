import ProfilePicture from "@/components/ProfilePicture";
import React from "react";
import EditButton from "./editButton";
import { UserType } from "@/lib/definitions";

export default function UserProfile({
  user,
}: {
  user: UserType;
}) {
  const pfp = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${user.pfp}`
  return (
    <div className="min-h-[550px] w-full flex items-center">
      <section className="w-full flex flex-col md:flex-row p-6 gap-6">
        <div className="w-full md:w-1/3  p-4 flex flex-col items-center justify-center gap-3">
          <div>
            <ProfilePicture image={pfp} size={120} />
          </div>
          <div className="w-full text-center">
            <h2 className="font-ubuntu font-bold text-2xl">{user?.name}</h2>
            <p className="text-gray-800 dark:text-gray-400">{user?.email}</p>
          </div>
          <EditButton />
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
            <p>{user?.phone || "N/A"}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <h3>Date of birth</h3>
            <p>{user?.dob || "N/A"}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <h3>Gender</h3>
            <p>{user?.gender || "N/A"}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <h3>Tokens Used</h3>
            <p>{user?.ai_tokens_used || 0}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
