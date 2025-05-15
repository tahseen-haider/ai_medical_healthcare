import "server-only"

import { getUser } from "./dal";

type ProfileDTO = {
  name: string | null;
  age: number | null;
  gender: string | null;
  email: string | null;
  phone: string | null;
};

export async function getProfileDTO(): Promise<ProfileDTO> {
  const currentUser = await getUser();

  return {
    name: currentUser?.name ?? null,
    age: currentUser?.age ?? null,
    gender: currentUser?.gender ?? null,
    email: currentUser?.email ?? null,
    phone: currentUser?.role === "admin" ? currentUser?.phone ?? null : null,
  };
}
