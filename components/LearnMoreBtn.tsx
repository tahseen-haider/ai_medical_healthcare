"use client";
import Btn from "./Button";
import { redirect } from "next/navigation";

export default function LearnMoreBtn() {
  return (
    <Btn
      onClick={() => {
        window.open("https://www.youtube.com/results?search_query=ai+in+medicine","_blank", "noopener,noreferrer");
      }}
      className="bg-light-1 hover:text-white w-fit font-bold text-2xl p-7"
    >
      Learn More
    </Btn>
  );
}
