"use client"
import Image from "next/image";
import PFP from "@/public/images/PFP.png";
import { useState } from "react";

export default function ProfilePicture({
  image,
  size = 32,
}: {
  image?: string;
  size?: number;
}) {
  const [imgSrc, setImgSrc] = useState(image || PFP);
  return (
    <div
      className="rounded-full overflow-hidden flex justify-center items-center cursor-pointer shadow-light dark:shadow-dark"
      style={{ width: size, height: size }}
    >
      <Image
        unoptimized
        src={imgSrc || PFP}
        key={image}
        width={size}
        height={size}
        alt="profile picture"
        className="object-cover w-full h-full"
        onError={() => setImgSrc(PFP)}
      />
    </div>
  );
}
