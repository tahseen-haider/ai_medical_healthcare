"use client";
import Image, { StaticImageData } from "next/image";
import PFP from "@/public/images/PFP.png";
import { useEffect, useState } from "react";

export default function ProfilePageImage({
  image,
  size = 32,
}: {
  image?: string;
  size?: number;
}) {
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(PFP);

  useEffect(() => {
    if (image && image.includes("res.cloudinary.com")) {
      const transformed = image.replace(
        "/upload/",
        `/upload/w_${size},h_${size},c_fill,q_auto,f_auto/`
      );
      setImgSrc(transformed);
    } else if (image) {
      setImgSrc(image);
    } else {
      setImgSrc(PFP);
    }
  }, [image, size]);

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
