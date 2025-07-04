import React from 'react'
import AppointmentPage from './components/AppointmentPage'
import { getUserIdnRoleIfAuthenticatedAction } from '@/lib/dal/user.dal'
import { getAllDoctors } from '@/actions/admin.action';

export default async function page() {
  const patient = await getUserIdnRoleIfAuthenticatedAction();
  const allDoctors = await getAllDoctors();
  return (
    <AppointmentPage patientId={patient?.userId} doctors={allDoctors.doctors}/>
  )
}
