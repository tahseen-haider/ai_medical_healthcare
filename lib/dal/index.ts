import { cache } from "react";
import "server-only";
import { prisma } from "../db/prisma";
import { ContactFormType, UserType } from "../definitions";

export const setAppointmentToDB = cache(
  async (data: {
    fullname: string;
    email: string;
    phone?: string | undefined;
    reasonForVisit: string;
    preferredDate: string;
    preferredTime: string;
    patientId?: string;
    doctorId: string;
  }) => {
    const {
      fullname,
      email,
      phone,
      reasonForVisit,
      preferredDate,
      preferredTime,
      patientId,
      doctorId,
    } = data;
    const appointment = await prisma.appointments.create({
      data: {
        fullname,
        email,
        phone,
        reasonForVisit,
        preferredDate,
        preferredTime,
        doctor: {
          connect: { id: doctorId },
        },
        ...(patientId && {
          patient: {
            connect: { id: patientId },
          },
        }),
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
  return submitted;
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
    const { email, imageUploadUrl, ...rest } = data;
    const filteredData = Object.fromEntries(
      Object.entries(rest).filter(([_, value]) => value !== "")
    );

    const updateData: any = {
      ...filteredData,
    };

    if (imageUploadUrl !== "") {
      updateData.pfp = imageUploadUrl;
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: updateData,
      });

      if (updatedUser) return 1;
    } catch {
      return 0;
    }
  }
);