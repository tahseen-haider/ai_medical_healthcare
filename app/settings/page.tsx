import { getCurrentlyAuthenticatedUser } from '@/actions/auth.action';
import React, { ReactElement } from 'react'
import { redirect } from 'next/navigation';
import AdminProfileEdit from './components/AdminProfileEdit';
import DoctorProfileEdit from './components/DoctorProfileEdit';
import UserProfileEdit from './components/UserProfileEdit';

export default async function Page(): Promise<ReactElement> {
  const user = await getCurrentlyAuthenticatedUser();
  if (!user) redirect("/");

  return user.role === "admin" ? (
    <AdminProfileEdit user={user} />
  ) : user.role === "doctor" ? (
    <DoctorProfileEdit user={user} />
  ) : (
    <UserProfileEdit user={user} />
  );
}
