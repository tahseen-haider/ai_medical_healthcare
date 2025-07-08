
"use client"
import { deleteUser } from '@/actions/admin.action'
import { Trash2 } from 'lucide-react'
import React, { useActionState } from 'react'

export default function DeleteUserBtn({userId}:{userId: string}) {
  const [state, action, pending] = useActionState(deleteUser,undefined)

  return (
    <form action={action}>
      <input name='userId' value={userId} hidden readOnly/>
      <button disabled={pending} type='submit' className=" bg-light-4 dark:bg-white text-white dark:text-black shadow-dark dark:shadow-dark text-lg p-1 rounded-md">
        <Trash2/>
      </button>
    </form>
  )
}
