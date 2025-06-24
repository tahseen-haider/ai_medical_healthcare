import { getUserIdnRoleIfAuthenticated } from '@/lib/session'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function DashboardLayout({children}:{children: React.ReactNode}) {
  const user = await getUserIdnRoleIfAuthenticated()

  if(!(user?.role === 'admin')) redirect("/")
  return (
    <div>{children}</div>
  )
}
