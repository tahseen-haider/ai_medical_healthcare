import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useActionState, useEffect, useState } from "react";
import { getCurrentlyAuthenticatedUser, logout } from "@/actions/auth.action";
import ProfilePicture from "../ProfilePicture";
import LoadingScreen from "../LoadingScreen";
import { UserProfileDTO } from "@/lib/dto/user.dto";
import Link from "next/link";

export default function ProfileButton() {
  const [state, action, pending] = useActionState(logout, undefined);
  const [user, setUser] = useState<UserProfileDTO | undefined>();
  useEffect(() => {
    (async function getUser() {
      const user = await getCurrentlyAuthenticatedUser();
      setUser(user);
    })();
  }, []);

  const navLinks = [
    {
      title: "Your Profile",
      link: "/your-profile",
    },
    {
      title: "Settings",
      link: "/settings",
    },
  ];

  return (
    <>
      {pending && <LoadingScreen message="Logging you out..." />}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ProfilePicture />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-light-1 dark:bg-dark-2 mt-2 flex flex-col gap-2">
          <DropdownMenuLabel>
            <Link href="/your-profile">{user?.name}</Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {navLinks.map((ele) => (
            <Link href={ele.link} key={ele.title} className=" w-full">
              {ele.title}
            </Link>
          ))}
          <DropdownMenuSeparator />
          <form action={action}>
            <Button type="submit" className="bg-red-500">
              Logout
            </Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
