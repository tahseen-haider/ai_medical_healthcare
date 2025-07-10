"use client";
import Image from "next/image";
import PFP from "@/public/images/PFP.png";
import { useEffect, useState } from "react";

export default function ProfilePageImage({
  image,
  size = 32,
}: {
  image?: string;
  size?: number;
}) {
  const [imgSrc, setImgSrc] = useState(image || PFP);

  useEffect(() => {
    setImgSrc(image || PFP);
  }, [image]);

  return (
    <div style={{ width: size, height: size }}>
      <Image
        unoptimized
        src={imgSrc}
        width={size}
        height={size}
        alt="profile picture"
        className="object-cover w-full h-full"
        onError={() => setImgSrc(PFP)}
      />
    </div>
  );
}
