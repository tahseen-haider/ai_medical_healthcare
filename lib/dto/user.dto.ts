import "server-only";
import { UserRole } from "../definitions";

export type UserProfileDTO = {
  name: string | null;
  dob: string | undefined;
  gender: string | undefined;
  email: string | null;
  phone: string | undefined;
  role: UserRole;
  pfp: string | undefined;
  ai_tokens_used: number | null
};

export type UserCredentialDTO = {
  id: string;
  email: string;
  password: string | null;
  role: UserRole;
  pfp: string | null
};

export type UserIDandRoleForSessionDTO = {
  id: string,
  role: UserRole
}