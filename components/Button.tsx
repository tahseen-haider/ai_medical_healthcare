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
        " bg-light-4 hover:-translate-y-0.5 dark:bg-white text-white dark:text-black shadow-dark dark:shadow-dark text-lg",
        className
      )}
    >
      {children}
    </Button>
  );
}
