import React from 'react'
import AppointmentPage from './components/AppointmentPage'
import { getUserIdnRoleIfAuthenticatedAction } from '@/lib/dal/user.dal'

export default async function page() {
  const patient = await getUserIdnRoleIfAuthenticatedAction();
  return (
    <AppointmentPage patientId={patient?.userId}/>
  )
}
