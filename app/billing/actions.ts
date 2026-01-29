"use server";

import { InvoiceStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { requirePermission } from "@/lib/rbac";

const invoiceSchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().optional(),
  totalCents: z.coerce.number().int().positive(),
  status: z.string().optional(),
  dueAt: z.string().optional(),
});

const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  amountCents: z.coerce.number().int().positive(),
  method: z.string().optional(),
  status: z.string().optional(),
});

export async function createInvoice(formData: FormData) {
  await requirePermission("billing.write");
  const payload = invoiceSchema.parse({
    patientId: formData.get("patientId"),
    appointmentId: formData.get("appointmentId") || undefined,
    totalCents: formData.get("totalCents"),
    status: formData.get("status"),
    dueAt: formData.get("dueAt"),
  });

  await prisma.invoice.create({
    data: {
      patientId: payload.patientId,
      appointmentId: payload.appointmentId || null,
      totalCents: payload.totalCents,
      status: payload.status ? (payload.status as InvoiceStatus) : InvoiceStatus.DRAFT,
      dueAt: payload.dueAt ? new Date(payload.dueAt) : null,
    },
  });

  revalidatePath("/billing");
}

export async function updateInvoice(id: string, formData: FormData) {
  await requirePermission("billing.write");
  const payload = invoiceSchema.parse({
    patientId: formData.get("patientId"),
    appointmentId: formData.get("appointmentId") || undefined,
    totalCents: formData.get("totalCents"),
    status: formData.get("status"),
    dueAt: formData.get("dueAt"),
  });

  await prisma.invoice.update({
    where: { id },
    data: {
      patientId: payload.patientId,
      appointmentId: payload.appointmentId || null,
      totalCents: payload.totalCents,
      status: payload.status ? (payload.status as InvoiceStatus) : InvoiceStatus.DRAFT,
      dueAt: payload.dueAt ? new Date(payload.dueAt) : null,
    },
  });

  revalidatePath("/billing");
}

export async function deleteInvoice(id: string) {
  await requirePermission("billing.write");
  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/billing");
}

export async function createPayment(formData: FormData) {
  await requirePermission("billing.write");
  const payload = paymentSchema.parse({
    invoiceId: formData.get("invoiceId"),
    amountCents: formData.get("amountCents"),
    method: formData.get("method"),
    status: formData.get("status"),
  });

  const status = payload.status ? (payload.status as PaymentStatus) : PaymentStatus.COMPLETED;
  await prisma.payment.create({
    data: {
      invoiceId: payload.invoiceId,
      amountCents: payload.amountCents,
      method: payload.method ? (payload.method as PaymentMethod) : PaymentMethod.CARD,
      status,
      paidAt: status === PaymentStatus.COMPLETED ? new Date() : null,
    },
  });

  revalidatePath("/billing");
}

export async function deletePayment(id: string) {
  await requirePermission("billing.write");
  await prisma.payment.delete({ where: { id } });
  revalidatePath("/billing");
}
