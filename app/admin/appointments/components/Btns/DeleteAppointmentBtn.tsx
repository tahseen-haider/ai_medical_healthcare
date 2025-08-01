"use client"
import { deleteAppointment} from '@/actions/admin.action'
import { Loader2, Trash2 } from 'lucide-react'
import React, { useActionState } from 'react'

export default function DeleteAppointmentBtn({appId}:{appId: string}) {
  const [state, action, pending] = useActionState(deleteAppointment,undefined)

  return (
    <form action={action}>
      <input name='appId' value={appId} hidden readOnly/>
      <button disabled={pending} type='submit' className=" bg-light-4 dark:bg-white text-white dark:text-black shadow-dark dark:shadow-dark text-lg p-2 rounded-md">
        {pending?<Loader2 size={20} className='animate-spin'/>:<Trash2 size={20}/>}
      </button>
    </form>
  )
}
