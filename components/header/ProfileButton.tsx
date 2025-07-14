"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useActionState, useState } from "react"
import { logout } from "@/actions/auth.action"
import ProfilePicture from "@/components/ProfilePicture"
import LoadingScreen from "@/components/LoadingScreen"
import Link from "next/link"

export default function ProfileButton({
  imageUrl,
  name,
}: {
  imageUrl?: string
  name?: string
}) {
  const [state, action, pending] = useActionState(logout, undefined)
  const [open, setOpen] = useState(false)

  const navLinks = [
    {
      title: "Your Profile",
      link: "/profile",
    },
    {
      title: "Your Appointments", // New link
      link: "/your-appointments",
    },
    {
      title: "Reset Password",
      link: "/reset-password",
    },
    // {
    //   title: "Settings",
    //   link: "/settings",
    // },
  ]

  return (
    <>
      {pending && <LoadingScreen message="Logging you out..." />}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild className="rounded-full">
          <Button variant="ghost" className="h-auto w-auto p-0 rounded-full">
            <ProfilePicture image={imageUrl} />
            <span className="sr-only">Open user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white dark:bg-dark-2 mt-2 flex flex-col p-1">
          <DropdownMenuLabel className="px-2 py-1.5 hover:bg-accent/50 rounded-sm cursor-pointer">
            <Link className="text-lg block" href="/profile" onClick={() => setOpen(false)}>
              {name || "User Name"}
            </Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {navLinks.map((ele) => (
            <DropdownMenuItem key={ele.title} asChild className="cursor-pointer px-2 py-1.5">
              <Link href={ele.link} onClick={() => setOpen(false)}>
                {ele.title}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <form action={action} onSubmit={() => setOpen(false)} className="p-1">
            <Button type="submit" className="w-full bg-light-4 dark:bg-gray-100 font-bold">
              Logout
            </Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
