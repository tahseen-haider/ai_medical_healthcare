import { getCurrentlyAuthenticatedUser } from '@/actions/auth.action';
import React from 'react'
import { redirect } from 'next/navigation';
import AdminProfileEdit from './components/AdminProfileEdit';
import UserProfileEdit from './components/UserProfileEdit';
import DoctorProfileEdit from './components/DoctorProfileEdit';

export default async function page() {
  const user = await getCurrentlyAuthenticatedUser();
  if (!user) return redirect("/");

  return user.role === "admin" ? (
    <AdminProfileEdit user={user} />
  ) : user.role === "doctor" ? (
    <DoctorProfileEdit user={user} />
  ) : (
    <UserProfileEdit user={user} />
  );
}
