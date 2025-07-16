"use client";

import { getAppointmentMessagesCount } from "@/actions";
import { UserType } from "@/lib/definitions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export default function DashboardLinks({
  links,
  user,
}: {
  user: UserType | undefined;
  links: {
    title: string;
    link: string;
  }[];
}) {
  const pathname = usePathname();
  const { data } = useSWR(
    user?.id ? `/notifications/${user.id}` : null,
    () => getAppointmentMessagesCount(user?.id),
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
      refreshWhenOffline: false,
      revalidateOnMount: true,
      shouldRetryOnError: true,
    }
  );

  const [notifications, setNotifications] = useState<number | undefined>(0);

  useEffect(() => {
    setNotifications(data);
  }, [data]);

  const hasNewMessages = notifications ? notifications > 0 : false;

  console.log(hasNewMessages);
  return (
    <div className="flex flex-col pl-2">
      {links.map((ele, index) => (
        <Link
          key={index}
          href={ele.link}
          className={`relative ${
            ele.link === pathname
              ? "text-white bg-light-4 dark:bg-dark-2 font-bold hover:text-white"
              : "text-gray-800 dark:text-gray-300 bg-gray-50 dark:bg-dark-4 hover:text-gray-500 dark:hover:text-gray-600"
          } 
          w-full p-2 rounded-sm`}
        >
          {ele.title}
          {ele.title === "Appointments" && hasNewMessages && (
            <span className="absolute top-0 right-4 bottom-0 my-auto inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
          )}
        </Link>
      ))}
    </div>
  );
}
