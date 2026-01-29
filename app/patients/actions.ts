"use server";

import { Gender } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceMemberId: z.string().optional(),
  notes: z.string().optional(),
});

function parseDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function createPatient(formData: FormData) {
  await requirePermission("patients.write");
  const payload = patientSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    phone: formData.get("phone"),
    email: formData.get("email") || undefined,
    address: formData.get("address"),
    emergencyContactName: formData.get("emergencyContactName"),
    emergencyContactPhone: formData.get("emergencyContactPhone"),
    insuranceProvider: formData.get("insuranceProvider"),
    insuranceMemberId: formData.get("insuranceMemberId"),
    notes: formData.get("notes"),
  });

  await prisma.patient.create({
    data: {
      ...payload,
      dateOfBirth: parseDate(payload.dateOfBirth ?? undefined),
      email: payload.email || null,
      gender: payload.gender ? (payload.gender as Gender) : null,
    },
  });

  revalidatePath("/patients");
}

export async function updatePatient(id: string, formData: FormData) {
  await requirePermission("patients.write");
  const payload = patientSchema.parse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    dateOfBirth: formData.get("dateOfBirth"),
    gender: formData.get("gender"),
    phone: formData.get("phone"),
    email: formData.get("email") || undefined,
    address: formData.get("address"),
    emergencyContactName: formData.get("emergencyContactName"),
    emergencyContactPhone: formData.get("emergencyContactPhone"),
    insuranceProvider: formData.get("insuranceProvider"),
    insuranceMemberId: formData.get("insuranceMemberId"),
    notes: formData.get("notes"),
  });

  await prisma.patient.update({
    where: { id },
    data: {
      ...payload,
      dateOfBirth: parseDate(payload.dateOfBirth ?? undefined),
      email: payload.email || null,
      gender: payload.gender ? (payload.gender as Gender) : null,
    },
  });

  revalidatePath("/patients");
}

export async function deletePatient(id: string) {
  await requirePermission("patients.write");
  await prisma.patient.delete({ where: { id } });
  revalidatePath("/patients");
}
