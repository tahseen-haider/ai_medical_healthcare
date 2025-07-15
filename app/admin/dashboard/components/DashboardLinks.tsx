"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function DashboardLinks({
  links,
}: {
  links: {
    title: string;
    link: string;
  }[];
}) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col pl-2">
      {links.map((ele, index) => (
        <Link key={index} href={ele.link} className={`${ele.link===pathname? 'text-white bg-light-4 dark:bg-dark-2 font-bold hover:text-white':'text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-dark-4 hover:text-gray-500 dark:hover:text-gray-600'} 
          w-full p-2 rounded-sm`}>
          {ele.title}
        </Link>
      ))}
    </div>
  );
}
