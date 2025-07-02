export type GetAllVerifiedUsersDTO = {
  pfp: string | null;
  name: string;
  role: string;
  email: string;
  createdAt: string;
}[]

export type GetInquiriesDTO = {
  name: string,
  email: string,
  message: string,
  is_read: boolean,
}[]