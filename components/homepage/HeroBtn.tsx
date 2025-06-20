"use client"
import { redirect } from "next/navigation";
import React from "react";
import Btn from "../Button";

export default function HeroBtn() {
  return (
    <Btn
      onClick={(e) => {
        redirect("/assistant");
      }}
      className="bg-light-4 dark:bg-dark-1 text-white hover:text-white font-bold text-3xl px-6 py-8"
    >
      Chat with Ai NOW
    </Btn>
  );
}
