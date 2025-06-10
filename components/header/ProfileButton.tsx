
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
import { logout } from "@/actions/auth.action";
import ProfilePicture from "../ProfilePicture";

export default function ProfileButton() {
  const [state, action, pending] = useActionState(logout, undefined)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ProfilePicture/>
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
