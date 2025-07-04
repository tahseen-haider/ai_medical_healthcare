"use client"
import Btn from '@/components/Button'
import { redirect } from 'next/navigation'
import React from 'react'

export default function DashManageMessagesBtn() {
  return (
    <Btn onClick={() => { redirect("/admin/inquiries") }}>Manage Inquiries</Btn>
  )
}
