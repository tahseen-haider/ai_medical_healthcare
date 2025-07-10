import { UserType } from "@/lib/definitions";
import React from "react";

export default function UserProfileEdit({ user }: { user: UserType }) {
  const pfp = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${user.pfp}`;
  return <div>UserProfileEdit</div>;
}
