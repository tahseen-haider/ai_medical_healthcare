"use client"
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";

export default function LogOutPage() {
  const [state, action, pending] = useActionState(logout, undefined)

  return (
    <form action={action}>
      <Button type="submit">Logout</Button>
    </form>
  )
}
