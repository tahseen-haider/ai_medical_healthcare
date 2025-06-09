import { cache } from "react";
import "server-only";
import { prisma } from "../db/prisma";
import { ContactFormType } from "../definitions";

export const setAppointmentToDB = cache(
  async (data: {
    fullname: string;
    email: string;
    phone: string;
    reasonForVisit: string;
    preferredDate: string;
    preferredTime: string;
  }) => {
    const {
      fullname,
      email,
      phone,
      reasonForVisit,
      preferredDate,
      preferredTime,
    } = data;
    const appointment = await prisma.appointments.create({
      data: {
        fullname,
        email,
        phone,
        reasonForVisit,
        preferredDate,
        preferredTime,
      },
    });
    return appointment;
  }
);

export const uploadInquiry = cache(async (data: ContactFormType) => {
  const submitted = await prisma.inquiries.create({
    data: {
      fullname: data.fullname,
      email: data.email,
      inquiry: data.inquiry
    }
  })
});
