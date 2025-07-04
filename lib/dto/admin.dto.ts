export type GetAllVerifiedUsersDTO = {
  pfp: string | null;
  name: string;
  role: string;
  email: string;
  createdAt: string;
}[]

export type GetInquiriesForDashboardDTO = {
  name: string,
  email: string,
  message: string,
  is_read: boolean,
}[]

export type GetAppointmentsForDashboardDTO = {
  patientName: string,
  doctorName: string,
  reasonForVisit: string,
  dateForVisit: string,
  status: string
}[]