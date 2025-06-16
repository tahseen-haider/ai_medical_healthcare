"use client"

import { useRouter } from "next/navigation";

export default function EditButton() {

  const router = useRouter()
  return (
    <button className="bg-light-1 dark:bg-dark-1 px-4 py-1 shadow-light border-2 dark:shadow-dark hover:shadow-none hover:dark:shadow-none font-bold text-lg rounded-lg" onClick={(e)=>{e.preventDefault(); router.push("/settings")}}>Edit</button>
  )
}
