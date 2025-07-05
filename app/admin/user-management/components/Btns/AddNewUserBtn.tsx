"use client"

import { addNewUser } from "@/actions/admin.action";
import Btn from "@/components/Button";
import LoadingScreen from "@/components/LoadingScreen";
import PopUpCard from "@/components/PopUpCard";
import { UserPlus2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

export default function AddNewUserBtn() {
  const [showPopUp, setShowPopUp] = useState(false);
  const [state, action, pending] = useActionState(addNewUser, undefined);

  useEffect(() => {
  if (state?.success) {
    setShowPopUp(false);
  }
}, [state]);

  return (
    <div className="">
      <Btn
        onClick={() => {
          setShowPopUp(true);
        }}
      >
        <UserPlus2 />
      </Btn>
      {pending && <LoadingScreen message="Adding New User..." />}
      {showPopUp && (
        <PopUpCard setState={setShowPopUp}>
          {/* Add new Doctor Form */}
          <div className="w-[300px] sm:w-[500px]">
            <h2 className="font-bold text-lg text-center">Add User</h2>
            <form
              action={action}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-6 w-full">
                <div className="w-full">
                  <label htmlFor="username" className="">
                    Full Name
                  </label>
                  <input
                    id="username"
                    type="username"
                    name="username"
                    placeholder="Dr. John Doe"
                    required
                    className="input-field"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="email" className="">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    required
                    className="input-field "
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="password" className="">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="********"
                    required
                    minLength={8}
                    maxLength={15}
                    className="input-field"
                  />
                </div>
              </div>
              {state?.message && <div className="text-red-500 text-center">{state?.message}</div>}
              <div className="w-full">
                <button
                  type="submit"
                  className="bg-light-4 dark:bg-white text-white dark:text-black shadow-dark dark:shadow-dark font-bold text-2xl px-4 py-1 rounded-sm mx-auto w-fit block"
                >
                  Add Doctor
                </button>
              </div>
            </form>
          </div>
        </PopUpCard>
      )}
    </div>
  );
}
