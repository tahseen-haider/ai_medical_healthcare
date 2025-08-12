"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function DroneImage() {
  const MotionImage = motion(Image);
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={constraintsRef}
      className="absolute w-full h-full"
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        className="absolute z-10 top-6 left-0 cursor-pointer w-1/6"
      >
        <MotionImage
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          src="/images/Drone.webp"
          alt="drone-image"
          width={150}
          height={150}
          className="pointer-events-none w-full"
        />
      </motion.div>
    </div>
  );
}
