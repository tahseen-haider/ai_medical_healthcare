import { getCurrentlyAuthenticatedUser } from '@/actions/auth.action';
import React from 'react'
import SettingsPage from './components/SettingsPage';

export default async function page() {
  const user = await getCurrentlyAuthenticatedUser();
  return (
    <>
      <SettingsPage user={user}/>
    </>
  )
}
