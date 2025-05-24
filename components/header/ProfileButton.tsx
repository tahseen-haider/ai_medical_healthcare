import Image from "next/image";
import PFP from "@/public/images/PFP.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Btn from "../Button";
import { Button } from "../ui/button";
import { useActionState } from "react";
import { logout } from "@/actions/auth";

export default function ProfileButton() {
  const [state, action, pending] = useActionState(logout, undefined)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={`rounded-full w-8 h-8 overflow-hidden shadow-[0_0_6px_rgba(0,0,0,0.4)] cursor-pointer`}
        >
          <Image src={PFP} width={32} height={32} alt="profile picture" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={action}>
            <Button type="submit" className="bg-red-500">Logout</Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
