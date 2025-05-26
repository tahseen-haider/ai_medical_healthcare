import Image from "next/image";
import PFP from "@/public/images/PFP.png";

export default function ProfilePicture() {
  return (
    <div
      className={`rounded-full w-8 h-8 overflow-hidden shadow-[0_0_6px_rgba(0,0,0,0.4)] cursor-pointer`}
    >
      <Image src={PFP} width={32} height={32} alt="profile picture" />
    </div>
  );
}
