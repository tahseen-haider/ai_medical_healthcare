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
      inquiry: data.inquiry,
    },
  });
});

export const uploadProfileChanges = cache(
  async (data: {
    name: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    imageUploadUrl: string;
  }) => {
    const { email, ...rest } = data;

    // Filter out empty string fields
    const filteredData = Object.fromEntries(
      Object.entries(rest).filter(([_, value]) => value !== "")
    );

    try {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          ...filteredData,
          pfp: filteredData.imageUploadUrl,
        },
      });

      return 1;
    } catch {
      return 0;
    }
  }
);
