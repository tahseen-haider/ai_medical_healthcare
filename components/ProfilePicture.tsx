import Image from "next/image";
import PFP from "@/public/images/PFP.png";

export default function ProfilePicture({
  image,
  size,
}: {
  image?: string;
  size?: number;
}) {
  return (
    <div
      className={`rounded-full ${
        size ? `w-[${size}px] h-[${size}px]` : "w-8 h-8"
      } overflow-hidden shadow-[0_0_6px_rgba(0,0,0,0.4)] flex justify-center items-center cursor-pointer object-cover`}
    >
      <Image
        unoptimized
        src={image ? image : PFP}
        key={image}
        width={size || 32}
        height={size || 32}
        alt="profile picture"
      />
    </div>
  );
}
