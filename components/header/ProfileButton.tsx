"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useActionState, useEffect, useState } from "react";
import { getCurrentlyAuthenticatedUser, logout } from "@/actions/auth.action";
import ProfilePicture from "../ProfilePicture";
import LoadingScreen from "../LoadingScreen";
import Link from "next/link";
import { UserType } from "@/lib/definitions";

export default function ProfileButton({ imageUrl }: { imageUrl?: string }) {
  const [state, action, pending] = useActionState(logout, undefined);

  const [user, setUser] = useState<UserType | undefined>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async function getUser() {
      const user = await getCurrentlyAuthenticatedUser();
      setUser(user);
    })();
  }, []);

  const navLinks = [
    {
      title: "Your Profile",
      link: "/profile",
    },
    {
      title: "Reset Password",
      link: "/reset-password",
    },
    // {
    //   title: "Settings",
    //   link: "/settings",
    // },
  ];

  return (
    <>
      {pending && <LoadingScreen message="Logging you out..." />}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="rounded-full">
          <ProfilePicture image={imageUrl} />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white dark:bg-dark-2 mt-2 flex flex-col">
          <DropdownMenuLabel>
            <Link
              className="text-lg"
              href="/profile"
              onClick={() => setOpen(false)}
            >
              {user?.name}
            </Link>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {navLinks.map((ele) => (
            <Link
              href={ele.link}
              key={ele.title}
              onClick={() => setOpen(false)}
              className="w-full px-3 py-1 hover:bg-light-4 hover:text-white rounded-sm"
            >
              {ele.title}
            </Link>
          ))}

          <DropdownMenuSeparator />

          <form
            action={action}
            onSubmit={() => setOpen(false)} // close on form submit
          >
            <Button
              type="submit"
              className="bg-light-4 dark:bg-gray-100 font-bold mt-3"
            >
              Logout
            </Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
