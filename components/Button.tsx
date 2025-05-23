"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import clsx from "clsx"; // Optional, for cleaner class merging

export default function Btn({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  return (
    <Button
      onClick={onClick}
      className={clsx(
        "bg-white hover:bg-gray-100 text-black shadow-[0_0_6px_rgba(0,0,0,0.4)]",
        className
      )}
    >
      {children}
    </Button>
  );
}
