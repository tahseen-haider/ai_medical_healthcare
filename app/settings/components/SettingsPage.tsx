"use client";
import ProfilePicture from "@/components/ProfilePicture";
import { UserProfileDTO } from "@/lib/dto/user.dto";
import { useActionState, useState } from "react";
import { DateOfBirthPicker } from "./DOBPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { saveProfileChanges } from "@/actions";
import LoadingScreen from "@/components/LoadingScreen";
import { Pencil } from "lucide-react";

const genderArray = ["Male", "Female"];

export default function SettingsPage({ user, imageUrl }: { user: UserProfileDTO, imageUrl?: string }) {
  const router = useRouter();

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [phone, setPhone] = useState<string | undefined>(user.phone);
  const [dob, setDob] = useState<string | undefined>(user.dob);
  const [gender, setGender] = useState(user?.gender);
  const [image, setImage] = useState<File | undefined>();

  const [state, action, pending] = useActionState(
    saveProfileChanges,
    undefined
  );

  const [changesMade, setChangesMade] = useState(false);

  return (
    <div className="w-full min-h-[550px] flex flex-col justify-center">
      {pending && <LoadingScreen message="Updating your profile" />}
      <form
        action={action}
        className="w-full"
        onSubmit={(e) => {
          setChangesMade(false);
        }}
      >
        <section className="w-full flex flex-col md:flex-row p-6 gap-6">
          <div className="w-full md:w-1/3 p-4 flex flex-col items-center justify-center gap-3">
            <div className="relative flex flex-col items-center">
              <div className="w-[120px]">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    width={120}
                    height={120}
                    className="object-cover w-[120px] h-[120px] rounded-full"
                  />
                ) : (
                  <ProfilePicture size={120} image={imageUrl}/>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  e.target.files && setImage(e.target.files[0]);
                }}
              />
              <label
                htmlFor="image-upload"
                className="absolute right-0 cursor-pointer inline-flex items-center justify-center rounded-full p-2 bg-gray-200 hover:bg-gray-300 transition"
              >
                <Pencil className="w-5 h-5 text-gray-700" />
              </label>
            </div>
            <div className="w-full text-center">
              <h2 className="font-ubuntu font-bold text-2xl">{name}</h2>
              <p className="text-gray-700 dark:text-gray-300">{email}</p>
            </div>
          </div>
          <div className="w-full md:w-2/3 border-2 p-4 flex flex-col gap-6 justify-center">
            <div className="grid grid-cols-2 gap-4 items-center">
              <h3>Full Name</h3>
              <input
                name="name"
                required
                type="text"
                maxLength={20}
                className="input-field"
                value={name!}
                onChange={(e) => {
                  setName((prev) => e.target.value);
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <h3>Email</h3>
              <input
                required
                name="email"
                type="text"
                maxLength={20}
                className=" p-1 text-black dark:text-white "
                value={email!}
                readOnly
              />
            </div>
            <div className="grid grid-cols-2 gap-4 items-center justify-center">
              <h3>Phone</h3>
              <input
                name="phone"
                type="text"
                maxLength={20}
                className="input-field"
                value={phone || ""}
                onChange={(e) => {
                  setPhone((prev) => e.target.value);
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <h3>Date of birth</h3>
              <DateOfBirthPicker value={dob} onChange={setDob} />
              <input
                name="dob"
                type="text"
                value={dob ? dob : ""}
                hidden
                readOnly
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <h3>Gender</h3>
              <input
                name="gender"
                type="text"
                value={gender ? gender : ""}
                hidden
                readOnly
              />
              <Select value={gender ? gender : ""} onValueChange={setGender}>
                <SelectTrigger className="w-20 h-8 text-gray-400 border-[1px] rounded-lg">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {genderArray.map((ele) => (
                    <SelectItem key={ele} value={ele}>
                      {ele}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>
        {/* Errors */}
        {state?.message && (
          <p className="w-full text-center mb-5 text-red-400">
            {state.message}
          </p>
        )}
        {/* Buttons */}
        <div className="w-full flex md:flex-row flex-col items-center justify-center mb-10 mt-2 gap-5">
          <div
            className="bg-light-3 cursor-pointer dark:bg-dark-1 px-4 py-1 shadow-light border-2 dark:shadow-dark hover:shadow-none hover:dark:shadow-none font-bold text-lg rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              if (
                name !== user.name ||
                // dob !== user.dob ||
                gender !== user.gender ||
                phone !== user.phone ||
                image
              ) {
                setChangesMade(true);
              }
            }}
          >
            Save Changes
          </div>
          <div
            className="bg-light-1 cursor-pointer dark:bg-dark-4 px-4 py-1 shadow-light border-2 dark:shadow-dark hover:shadow-none hover:dark:shadow-none font-bold text-lg rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              // setDob(user.dob);
              setName(user.name);
              setEmail(user.email);
              setPhone(user.phone);
              setGender(user.gender);
            }}
          >
            Reset Changes
          </div>
          <div
            className="bg-light-1 cursor-pointer dark:bg-dark-4 px-4 py-1 shadow-light border-2 dark:shadow-dark hover:shadow-none hover:dark:shadow-none font-bold text-lg rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              router.push("/your-profile");
            }}
          >
            Show Profile
          </div>
        </div>
        {changesMade && (
          <div className="fixed inset-0 w-full h-full z-30 flex justify-center items-center backdrop-blur-sm">
            <div
              className="absolute  w-full h-full z-0"
              onClick={(e) => {
                e.stopPropagation();
                setChangesMade(false);
              }}
            />
            <div className="w-5/6 max-w-[500px] min-w-[300px] z-10 bg-white shadow-light text-black text-center flex flex-col items-center p-3 rounded-lg">
              <div className="w-full flex flex-col items-center font-bold gap-3">
                Enter your password to save Changes:
                <input
                  autoFocus
                  type="password"
                  placeholder="*******"
                  name="password"
                  className="bg-white w-64 dark:bg-dark-4 p-1 text-black dark:text-white rounded-sm border-2"
                  required
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-light-4 cursor-pointer dark:bg-dark-3 text-black dark:text-white px-4 py-1 shadow-light border-2 dark:shadow-dark hover:shadow-none hover:dark:shadow-none font-bold text-lg rounded-lg"
                  >
                    Submit Changes
                  </button>
                  <div
                    className="bg-light-1 cursor-pointer text-black dark:text-white dark:bg-dark-4 px-4 py-1 shadow-light border-2 dark:shadow-dark hover:shadow-none hover:dark:shadow-none font-bold text-lg rounded-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      setChangesMade(false);
                    }}
                  >
                    Cancel
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
