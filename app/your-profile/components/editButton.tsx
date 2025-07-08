"use client"

import Btn from "@/components/Button";
import { Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditButton() {

  const router = useRouter()
  return (
    <Btn onClick={(e)=>{e.preventDefault(); router.push("/settings")}}><Edit3 className="inline mr-2"/> Edit Profile</Btn>
  )
}
