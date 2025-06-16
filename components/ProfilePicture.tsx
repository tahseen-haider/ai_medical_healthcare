"use client";

import Image from "next/image";
import PFP from "@/public/images/PFP.png";
import { useEffect, useState } from "react";
import { getPfp } from "@/actions";

export default function ProfilePicture({ size }: { size?: number }) {
  const [image, setImage] = useState<string | undefined>();
  useEffect(() => {
    (async function getImage() {
      const pfp = await getPfp();
      if (pfp) setImage(pfp);
    })();
  }, []);
  return (
    <div
      className={`rounded-full ${
        size ? `w-[${size}px] h-[${size}px]` : "w-8 h-8"
      } overflow-hidden shadow-[0_0_6px_rgba(0,0,0,0.4)] flex justify-center items-center cursor-pointer object-cover`}
    >
      {image ? (
        <Image
          unoptimized
          src={image}
          width={size || 32}
          height={size || 32}
          alt="profile picture"
        />
      ) : (
        <Image
          src={PFP}
          width={size || 32}
          height={size || 32}
          alt="profile picture"
        />
      )}
    </div>
  );
}
