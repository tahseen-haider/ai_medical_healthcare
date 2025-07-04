"use client"
import Btn from '@/components/Button'
import { redirect } from 'next/navigation'
import React from 'react'

export default function DashManageAppointmentsBtn() {
  return (
    <Btn onClick={() => { redirect("/admin/appointments") }}>Manage Appointments</Btn>
  )
}
