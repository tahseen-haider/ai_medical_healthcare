"use client";

import React from "react";
import { deleteUserAccount } from "@/actions/auth.action";
import { useActionState } from "react";

interface DeleteAccountConfirmationProps {
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export default function DeleteAccountConfirmation({
  setIsDeleting,
  onClose,
}: DeleteAccountConfirmationProps) {
  const [state, formAction, isPending] = useActionState(
    deleteUserAccount,
    undefined
  );

  React.useEffect(() => {
    setIsDeleting(isPending);
  }, [isPending, setIsDeleting]);

  return (
    <div
      className="fixed top-0 z-50 flex justify-center items-center w-full h-full backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl bg-light-4 dark:bg-dark-4 shadow-light dark:shadow-dark text-black dark:text-white 
                   flex flex-col gap-6 items-center justify-between p-6"
      >
        <div className="text-center text-white">
          <h3 className="font-bold font-ubuntu text-lg">
            Do You Really Want To Delete Your Account?
          </h3>
          <p className="text-black dark:text-gray-200">This is irreversible</p>
        </div>
        <div className="flex gap-4">
          <form
            action={formAction}
            onSubmit={() => {
              onClose(); // Close after action trigger
            }}
          >
            <button
              type="submit"
              className="bg-red-500 py-2 px-4 rounded-lg text-white"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Your Account"}
            </button>
          </form>
          <button
            className="bg-gray-100 py-2 px-4 rounded-lg text-black"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
