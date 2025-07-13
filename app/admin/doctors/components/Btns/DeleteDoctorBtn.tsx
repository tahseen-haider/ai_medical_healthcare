
"use client"
import { deleteDoctor } from '@/actions/admin.action'
import { Loader2, Trash2 } from 'lucide-react'
import React, { useActionState } from 'react'

export default function DeleteDoctorBtn({doctorId}:{doctorId: string}) {
  const [state, action, pending] = useActionState(deleteDoctor,undefined)

  return (
    <>
    <form action={action}>
      <input name='doctorId' value={doctorId} hidden readOnly/>
      <button disabled={pending} type='submit' className=" bg-light-4 dark:bg-white text-white dark:text-black shadow-dark dark:shadow-dark text-lg p-1 rounded-md">
        {pending?<Loader2 className='animate-spin'/>:<Trash2/>}
      </button>
    </form>
    </>
  )
}
