
"use client"
import { deleteInquiry } from '@/actions/admin.action'
import { Trash2 } from 'lucide-react'
import React, { useActionState } from 'react'

export default function DeleteInquiryButton({inquiryId, page}:{inquiryId: string, page:number}) {
  const [state, action, pending] = useActionState(deleteInquiry,undefined)

  return (
    <>
    <form action={action} className='h-full flex mx-2'>
      <input name='page' value={page} hidden readOnly/>
      <input name='inquiryId' value={inquiryId} hidden readOnly/>
      <button disabled={pending} type='submit' className=" bg-light-4 dark:bg-white text-white dark:text-black shadow-dark dark:shadow-dark text-lg p-1 rounded-md">
        <Trash2/>
      </button>
    </form>
    </>
  )
}
