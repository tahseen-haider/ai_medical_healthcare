"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function BotImage() {
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Detect touch device
  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleToggle = () => {
    if (isTouch) setHovered((prev) => !prev);
  };

  return (
    <div
      draggable={false}
      className="absolute cursor-pointer z-20 -bottom-6 left-10 w-2/6 h-fit group"
      onMouseEnter={() => !isTouch && setHovered(true)}
      onMouseLeave={() => !isTouch && setHovered(false)}
      onTouchStart={handleToggle}
    >
      {!hovered ? (
        <Image
          draggable={false}
          src="/images/Bot.webp"
          alt="bot-image"
          width={900}
          height={900}
          className="w-full h-full"
        />
      ) : (
        <Image
          draggable={false}
          src="/images/Bot-Hello.webp"
          alt="bot-image-hover"
          width={900}
          height={900}
          className="w-full h-full"
        />
      )}
    </div>
  );
}
