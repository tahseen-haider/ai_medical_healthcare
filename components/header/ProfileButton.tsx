"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { logout } from "@/actions/auth.action";
import ProfilePicture from "@/components/ProfilePicture";
import LoadingScreen from "@/components/LoadingScreen";
import Link from "next/link";
import useSWR from "swr";
import { UserType } from "@/lib/definitions";
import { getAppointmentMessages } from "@/actions";
import { $Enums } from "@prisma/client";

export default function ProfileButton({ user }: { user: UserType }) {
  const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${user?.pfp}`;

  const { data } = useSWR(
    user.id ? `/notifications/${user.id}` : null,
    () => getAppointmentMessages(user.id),
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
      refreshWhenOffline: false,
      revalidateOnMount: true,
      shouldRetryOnError: true,
    }
  );

  const [notifications, setNotifications] = useState<
    | {
        message: string;
        userId: string;
        type: $Enums.NotificationType;
        link: string | null;
        id: string;
        title: string;
        read: boolean;
        createdAt: Date;
        relatedId: string | null;
      }[]
    | undefined
  >([]);

  useEffect(() => {
    setNotifications(data);
  }, [data]);

  const unreadCount = notifications?.filter((n) => !n.read)?.length || 0;

  const [state, action, pending] = useActionState(logout, undefined);
  const [open, setOpen] = useState(false);

  const navLinks = [
    { title: "Your Profile", link: "/profile" },
    { title: "Your Appointments", link: "/your-appointments" },
    { title: "Reset Password", link: "/reset-password" },
  ];

  return (
    <>
      {pending && <LoadingScreen message="Logging you out..." />}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild className="relative rounded-full">
          <Button variant="ghost" className="h-auto w-auto p-0 rounded-full">
            {/* Badge */}
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
            )}
            <ProfilePicture image={imageUrl} />
            <span className="sr-only">Open user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white dark:bg-dark-2 mt-2 flex flex-col p-1">
          <DropdownMenuLabel className="px-2 py-1.5 hover:bg-accent/50 rounded-sm cursor-pointer">
            <Link
              className="text-lg block"
              href="/profile"
              onClick={() => setOpen(false)}
            >
              {user.name || "User Name"}
            </Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {navLinks.map((ele) => (
            <DropdownMenuItem
              key={ele.title}
              asChild
              className="cursor-pointer px-2 py-1.5"
            >
              <Link
                href={ele.link}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between w-full"
              >
                {ele.title}
                {ele.title === "Your Appointments" && unreadCount > 0 && (
                  <span className="ml-2 w-4 h-4 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <form action={action} onSubmit={() => setOpen(false)} className="p-1">
            <Button
              type="submit"
              className="w-full bg-light-4 dark:bg-gray-100 font-bold"
            >
              Logout
            </Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
