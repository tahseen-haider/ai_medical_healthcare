"use client"
import { login } from "@/actions/auth";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
      {(state?.errors?.email || state?.errors?.password) && <p>{state.errors.email}</p>}
    </form>
  )
}