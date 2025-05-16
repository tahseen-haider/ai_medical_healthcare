import "server-only";
import { UserRole } from "../definitions";

export type UserProfileDTO = {
  name: string | null;
  dob: string | null;
  gender: string | null;
  email: string | null;
  phone: string | null;
  role: UserRole;
};

export type UserCredentialDTO = {
  id: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UserIDandRoleForSessionDTO = {
  id: string,
  role: UserRole
}