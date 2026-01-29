"use server";

import { AppointmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

const appointmentSchema = z.object({
  patientId: z.string().min(1),
  providerId: z.string().min(1),
  scheduledAt: z.string().min(1),
  status: z.string().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export async function createAppointment(formData: FormData) {
  await requirePermission("appointments.write");
  const payload = appointmentSchema.parse({
    patientId: formData.get("patientId"),
    providerId: formData.get("providerId"),
    scheduledAt: formData.get("scheduledAt"),
    status: formData.get("status"),
    reason: formData.get("reason"),
    notes: formData.get("notes"),
  });

  await prisma.appointment.create({
    data: {
      patientId: payload.patientId,
      providerId: payload.providerId,
      scheduledAt: new Date(payload.scheduledAt),
      status: payload.status ? (payload.status as AppointmentStatus) : AppointmentStatus.SCHEDULED,
      reason: payload.reason,
      notes: payload.notes,
    },
  });

  revalidatePath("/appointments");
}

export async function updateAppointment(id: string, formData: FormData) {
  await requirePermission("appointments.write");
  const payload = appointmentSchema.parse({
    patientId: formData.get("patientId"),
    providerId: formData.get("providerId"),
    scheduledAt: formData.get("scheduledAt"),
    status: formData.get("status"),
    reason: formData.get("reason"),
    notes: formData.get("notes"),
  });

  await prisma.appointment.update({
    where: { id },
    data: {
      patientId: payload.patientId,
      providerId: payload.providerId,
      scheduledAt: new Date(payload.scheduledAt),
      status: payload.status ? (payload.status as AppointmentStatus) : AppointmentStatus.SCHEDULED,
      reason: payload.reason,
      notes: payload.notes,
    },
  });

  revalidatePath("/appointments");
}

export async function deleteAppointment(id: string) {
  await requirePermission("appointments.write");
  await prisma.appointment.delete({ where: { id } });
  revalidatePath("/appointments");
}
