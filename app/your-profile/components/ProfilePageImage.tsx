"use client"
import Image from "next/image";
import PFP from "@/public/images/PFP.png";
import { useState } from "react";

export default function ProfilePageImage({
  image,
  size = 32,
}: {
  image?: string;
  size?: number;
}) {
  const [imgSrc, setImgSrc] = useState(image || PFP);
  return (
    <div
      style={{ width: size, height: size }}
    >
      <Image
        unoptimized
        src={imgSrc || PFP}
        key={image}
        width={size}
        height={size}
        alt="profile picture"
        className="object-cover"
        onError={() => setImgSrc(PFP)}
      />
    </div>
  );
}
