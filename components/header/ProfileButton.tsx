"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useActionState, useEffect, useState } from "react";
import {
  deleteUserAccount,
  getCurrentlyAuthenticatedUser,
  logout,
} from "@/actions/auth.action";
import ProfilePicture from "../ProfilePicture";
import LoadingScreen from "../LoadingScreen";
import { UserProfileDTO } from "@/lib/dto/user.dto";
import Link from "next/link";
import { UserType } from "@/lib/definitions";

export default function ProfileButton({ imageUrl }: { imageUrl?: string }) {
  const [state, action, pending] = useActionState(logout, undefined);
  const [stateDeletingAccount, deleteAccountAction, pendingDeletingAccount] =
    useActionState(deleteUserAccount, undefined);

  const [user, setUser] = useState<UserType | undefined>();
  const [open, setOpen] = useState(false);
  const [showDeleteAccountPopUp, setShowDeleteAccountPopUp] = useState(false);

  useEffect(() => {
    (async function getUser() {
      const user = await getCurrentlyAuthenticatedUser();
      setUser(user);
    })();
  }, []);

  const navLinks = [
    {
      title: "Your Profile",
      link: "/profile",
    },
    {
      title: "Reset Password",
      link: "/reset-password",
    },
    // {
    //   title: "Settings",
    //   link: "/settings",
    // },
  ];

  return (
    <>
      {(pendingDeletingAccount) && (
        <LoadingScreen message="Deleting your account..." />
      )}
      {(pending) && (
        <LoadingScreen message="Logging you out..." />
      )}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger className="rounded-full">
          <ProfilePicture image={imageUrl} />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-white dark:bg-dark-2 mt-2 flex flex-col">
          <DropdownMenuLabel>
            <Link
              className="text-lg"
              href="/profile"
              onClick={() => setOpen(false)}
            >
              {user?.name}
            </Link>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {navLinks.map((ele) => (
            <Link
              href={ele.link}
              key={ele.title}
              onClick={() => setOpen(false)}
              className="w-full px-3 py-1 hover:bg-light-4 hover:text-white rounded-sm"
            >
              {ele.title}
            </Link>
          ))}

          <DropdownMenuSeparator />

          <form
            action={action}
            onSubmit={() => setOpen(false)} // close on form submit
          >
            <Button
              type="submit"
              className="bg-light-4 dark:bg-gray-100 font-bold mt-3"
            >
              Logout
            </Button>
          </form>

          <Button
            onClick={() => {
              setShowDeleteAccountPopUp(true);
              setOpen(false); // close when delete is clicked
            }}
            className="bg-red-500 mt-3 font-bold"
          >
            Delete Account
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
      {showDeleteAccountPopUp && (
        <div
          className="fixed top-0 z-50 flex justify-center items-center w-full h-full backdrop-blur-xs"
          onClick={() => {
            setShowDeleteAccountPopUp(false);
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className=" rounded-2xl bg-light-4 dark:bg-dark-4 shadow-light dark:shadow-dark text-black dark:text-white 
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
                action={deleteAccountAction}
                onSubmit={() => {
                  setShowDeleteAccountPopUp(false);
                }}
              >
                <button
                  type="submit"
                  className="bg-red-500 py-2 px-4 rounded-lg text-white"
                >
                  Delete Your Account
                </button>
              </form>
              <button
                className="bg-gray-100 py-2 px-4 rounded-lg text-black"
                onClick={() => {
                  setShowDeleteAccountPopUp(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
