import { getCurrentlyAuthenticatedUser } from '@/actions/auth.action';
import React from 'react'
import SettingsPage from './components/SettingsPage';
import { getPfp } from '@/actions';
import { redirect } from 'next/navigation';

export default async function page() {
  const user = await getCurrentlyAuthenticatedUser();
  if(!user) return redirect("/")
  const imageUrl = await getPfp()
  return (
    <>
      <SettingsPage user={user} imageUrl={imageUrl}/>
    </>
  )
}
