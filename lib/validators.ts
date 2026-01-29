import { z } from "zod";

export const patientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
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

export const providerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  specialty: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  npi: z.string().optional(),
  availability: z.string().optional(),
  active: z.string().optional(),
});

export const appointmentSchema = z.object({
  patientId: z.string().min(1),
  providerId: z.string().min(1),
  scheduledAt: z.string().min(1),
  status: z.string().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const invoiceSchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().optional().or(z.literal("")),
  status: z.string().optional(),
  totalCents: z.string().min(1),
  dueAt: z.string().optional(),
});

export const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  amountCents: z.string().min(1),
  method: z.string().optional(),
  status: z.string().optional(),
  paidAt: z.string().optional(),
});

export const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  roleId: z.string().min(1),
});

export const roleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissionKeys: z.array(z.string()).optional(),
});

export const userRoleSchema = z.object({
  userId: z.string().min(1),
  roleId: z.string().min(1),
});

export const fileSchema = z.object({
  patientId: z.string().optional().or(z.literal("")),
  filename: z.string().min(1),
  url: z.string().url(),
});
