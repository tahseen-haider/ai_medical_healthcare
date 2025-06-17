import { getCurrentlyAuthenticatedUser } from '@/actions/auth.action';
import React from 'react'
import SettingsPage from './components/SettingsPage';
import { getPfp } from '@/actions';

export default async function page() {
  const user = await getCurrentlyAuthenticatedUser();
  const imageUrl = await getPfp()
  return (
    <>
      <SettingsPage user={user} imageUrl={imageUrl}/>
    </>
  )
}
